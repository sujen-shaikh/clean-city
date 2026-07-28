import bcrypt from 'bcryptjs';
import { getDb } from '../config/db.js';

const normalizeUser = (row) => ({
  id: row.id,
  email: row.email,
  password: row.password,
  name: row.name,
  profilePhoto: row.profile_photo,
  phone: row.phone,
  address: row.address,
  role: row.role || 'user',
  isVerified: Boolean(row.is_verified),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

class User {
  constructor(data = {}) {
    this.id = data.id ?? null;
    this.email = data.email ?? '';
    this.password = data.password ?? null;
    this.name = data.name ?? '';
    this.profilePhoto = data.profilePhoto ?? data.profile_photo ?? null;
    this.phone = data.phone ?? null;
    this.address = data.address ?? null;
    this.role = data.role ?? 'user';
    this.isVerified = data.isVerified ?? data.is_verified ?? false;
    this.createdAt = data.createdAt ?? data.created_at ?? null;
    this.updatedAt = data.updatedAt ?? data.updated_at ?? null;
  }

  async save() {
    const db = getDb();
    if (this.id) {
      const stmt = db.prepare(`
        UPDATE users
        SET email = ?, password = ?, name = ?, profile_photo = ?, phone = ?, address = ?, role = ?, is_verified = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      stmt.run(
        this.email,
        this.password,
        this.name,
        this.profilePhoto,
        this.phone,
        this.address,
        this.role,
        this.isVerified ? 1 : 0,
        this.id
      );
      return this;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    const stmt = db.prepare(`
      INSERT INTO users (email, password, name, profile_photo, phone, address, role, is_verified)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      this.email,
      hashedPassword,
      this.name,
      this.profilePhoto,
      this.phone,
      this.address,
      this.role,
      this.isVerified ? 1 : 0
    );
    this.id = result.lastInsertRowid;
    this.password = hashedPassword;
    this.createdAt = new Date().toISOString();
    this.updatedAt = this.createdAt;
    return this;
  }

  async matchPassword(enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password || '');
  }

  toJSON() {
    const clone = { ...this };
    delete clone.password;
    return clone;
  }

  static async findOne({ email } = {}) {
    const db = getDb();
    const row = db.prepare('SELECT * FROM users WHERE email = ? LIMIT 1').get(email);
    return row ? new User(normalizeUser(row)) : null;
  }

  static async findById(id) {
    const db = getDb();
    const row = db.prepare('SELECT * FROM users WHERE id = ? LIMIT 1').get(id);
    return row ? new User(normalizeUser(row)) : null;
  }

  static async findByIdAndUpdate(id, updates = {}, options = {}) {
    const db = getDb();
    const existing = await User.findById(id);
    if (!existing) {
      return null;
    }

    const next = new User({
      ...existing,
      ...updates,
      id: existing.id,
      profilePhoto: updates.profilePhoto ?? existing.profilePhoto,
      phone: updates.phone ?? existing.phone,
      address: updates.address ?? existing.address,
      name: updates.name ?? existing.name,
      role: updates.role ?? existing.role,
      isVerified: updates.isVerified ?? existing.isVerified,
    });

    await next.save();
    return next;
  }
}

export default User;
