import { getDb } from '../config/db.js';

const parseJson = (value, fallback = []) => {
  if (!value) return fallback;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (error) {
      return fallback;
    }
  }
  return value;
};

const normalizeReport = (row) => ({
  id: row.id,
  title: row.title,
  description: row.description,
  category: row.category,
  status: row.status,
  priority: row.priority,
  submittedBy: row.submitted_by,
  location: {
    type: 'Point',
    coordinates: [row.longitude, row.latitude],
  },
  address: row.address,
  photos: parseJson(row.photos, []),
  afterPhotos: parseJson(row.after_photos, []),
  confirmations: parseJson(row.confirmations, []),
  assignedOfficer: row.assigned_officer,
  resolvedBy: row.resolved_by,
  resolvedAt: row.resolved_at,
  comments: parseJson(row.comments, []),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

class Report {
  constructor(data = {}) {
    this.id = data.id ?? null;
    this.title = data.title ?? '';
    this.description = data.description ?? '';
    this.category = data.category ?? null;
    this.status = data.status ?? 'reported';
    this.priority = data.priority ?? 0;
    this.submittedBy = data.submittedBy ?? data.submitted_by ?? null;
    this.location = data.location ?? { type: 'Point', coordinates: [0, 0] };
    this.address = data.address ?? null;
    this.photos = Array.isArray(data.photos) ? data.photos : parseJson(data.photos, []);
    this.afterPhotos = Array.isArray(data.afterPhotos) ? data.afterPhotos : parseJson(data.afterPhotos, []);
    this.confirmations = Array.isArray(data.confirmations) ? data.confirmations : parseJson(data.confirmations, []);
    this.assignedOfficer = data.assignedOfficer ?? data.assigned_officer ?? null;
    this.resolvedBy = data.resolvedBy ?? data.resolved_by ?? null;
    this.resolvedAt = data.resolvedAt ?? data.resolved_at ?? null;
    this.comments = Array.isArray(data.comments) ? data.comments : parseJson(data.comments, []);
    this.createdAt = data.createdAt ?? data.created_at ?? null;
    this.updatedAt = data.updatedAt ?? data.updated_at ?? null;
  }

  async save() {
    const db = getDb();
    const lat = this.location?.coordinates?.[1] ?? 0;
    const lng = this.location?.coordinates?.[0] ?? 0;

    if (this.id) {
      const stmt = db.prepare(`
        UPDATE reports
        SET title = ?, description = ?, category = ?, status = ?, priority = ?, submitted_by = ?, latitude = ?, longitude = ?, address = ?, photos = ?, after_photos = ?, confirmations = ?, assigned_officer = ?, resolved_by = ?, resolved_at = ?, comments = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      stmt.run(
        this.title,
        this.description,
        this.category,
        this.status,
        this.priority,
        this.submittedBy,
        lat,
        lng,
        this.address,
        JSON.stringify(this.photos),
        JSON.stringify(this.afterPhotos),
        JSON.stringify(this.confirmations),
        this.assignedOfficer,
        this.resolvedBy,
        this.resolvedAt,
        JSON.stringify(this.comments),
        this.id
      );
      return this;
    }

    const stmt = db.prepare(`
      INSERT INTO reports (title, description, category, status, priority, submitted_by, latitude, longitude, address, photos, after_photos, confirmations, assigned_officer, resolved_by, resolved_at, comments)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      this.title,
      this.description,
      this.category,
      this.status,
      this.priority,
      this.submittedBy,
      lat,
      lng,
      this.address,
      JSON.stringify(this.photos),
      JSON.stringify(this.afterPhotos),
      JSON.stringify(this.confirmations),
      this.assignedOfficer,
      this.resolvedBy,
      this.resolvedAt,
      JSON.stringify(this.comments)
    );
    this.id = result.lastInsertRowid;
    this.createdAt = new Date().toISOString();
    this.updatedAt = this.createdAt;
    return this;
  }

  static async create(data) {
    const report = new Report(data);
    await report.save();
    return report;
  }

  static async list({ status, category, page = 1, limit = 10 } = {}) {
    const db = getDb();
    let sql = 'SELECT * FROM reports';
    const conditions = [];
    const params = [];

    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }

    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }

    if (conditions.length) {
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), (Number(page) - 1) * Number(limit));

    return db.prepare(sql).all(...params).map((row) => new Report(normalizeReport(row)));
  }

  static async count({ status, category } = {}) {
    const db = getDb();
    let sql = 'SELECT COUNT(*) AS total FROM reports';
    const conditions = [];
    const params = [];

    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }

    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }

    if (conditions.length) {
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    return db.prepare(sql).get(...params).total;
  }

  static async findById(id) {
    const db = getDb();
    const row = db.prepare('SELECT * FROM reports WHERE id = ? LIMIT 1').get(id);
    return row ? new Report(normalizeReport(row)) : null;
  }

  static async findNearby({ latitude, longitude, maxDistance = 500 } = {}) {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM reports').all();
    const radiusInMeters = Number(maxDistance);
    const maxLatDelta = radiusInMeters / 111320;
    const maxLngDelta = radiusInMeters / (111320 * Math.cos((Number(latitude) * Math.PI) / 180));

    return rows
      .map((row) => new Report(normalizeReport(row)))
      .filter((report) => {
        const [lng, lat] = report.location.coordinates;
        const latDiff = Math.abs(lat - Number(latitude));
        const lngDiff = Math.abs(lng - Number(longitude));

        if (latDiff > maxLatDelta || lngDiff > maxLngDelta) {
          return false;
        }

        const earthRadius = 6371000;
        const dLat = ((lat - Number(latitude)) * Math.PI) / 180;
        const dLng = ((lng - Number(longitude)) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((Number(latitude) * Math.PI) / 180) *
            Math.cos((lat * Math.PI) / 180) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = earthRadius * c;
        return distance <= radiusInMeters;
      });
  }

  static async update(id, updates = {}) {
    const existing = await Report.findById(id);
    if (!existing) {
      return null;
    }

    const next = new Report({
      ...existing,
      ...updates,
      id: existing.id,
      submittedBy: updates.submittedBy ?? existing.submittedBy,
      assignedOfficer: updates.assignedOfficer ?? existing.assignedOfficer,
      resolvedBy: updates.resolvedBy ?? existing.resolvedBy,
      resolvedAt: updates.resolvedAt ?? existing.resolvedAt,
      photos: updates.photos ?? existing.photos,
      afterPhotos: updates.afterPhotos ?? existing.afterPhotos,
      confirmations: updates.confirmations ?? existing.confirmations,
      comments: updates.comments ?? existing.comments,
      location: updates.location ?? existing.location,
    });

    await next.save();
    return next;
  }
}

export default Report;
