import Report from '../models/Report.js';
import cloudinary from '../config/cloudinary.js';
import User from '../models/User.js';
import { getDb } from '../config/db.js';

const getUserSummary = async (userId) => {
  if (!userId) return null;
  const user = await User.findById(userId);
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    profilePhoto: user.profilePhoto,
  };
};

const serializeReport = async (report) => {
  const submittedBy = await getUserSummary(report.submittedBy);
  const assignedOfficer = await getUserSummary(report.assignedOfficer);
  const resolvedBy = await getUserSummary(report.resolvedBy);
  const confirmations = await Promise.all(
    (report.confirmations || []).map(async (confirmation) => ({
      ...confirmation,
      userId: await getUserSummary(confirmation.userId),
    }))
  );
  const comments = await Promise.all(
    (report.comments || []).map(async (comment) => ({
      ...comment,
      userId: await getUserSummary(comment.userId),
    }))
  );

  return {
    ...report,
    submittedBy,
    assignedOfficer,
    resolvedBy,
    confirmations,
    comments,
  };
};

export const getReports = async (req, res) => {
  try {
    const { status, category, page = 1, limit = 10 } = req.query;
    const reports = await Report.list({ status, category, page, limit });
    const total = await Report.count({ status, category });

    res.status(200).json({
      success: true,
      count: reports.length,
      total,
      page: parseInt(page),
      reports: await Promise.all(reports.map(serializeReport)),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getReportsNearby = async (req, res) => {
  try {
    const { latitude, longitude, maxDistance = 500 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ success: false, message: 'Latitude and longitude are required' });
    }

    const reports = await Report.findNearby({
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      maxDistance: parseInt(maxDistance),
    });

    res.status(200).json({
      success: true,
      count: reports.length,
      reports: await Promise.all(reports.map(serializeReport)),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    res.status(200).json({
      success: true,
      report: await serializeReport(report),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createReport = async (req, res) => {
  try {
    const { title, description, category, latitude, longitude, address } = req.body;

    if (!title || !description || !category || !latitude || !longitude) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const report = await Report.create({
      title,
      description,
      category,
      submittedBy: req.user.id,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
      address,
    });

    if (req.file) {
      try {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'cleancity/reports',
              resource_type: 'auto',
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );

          uploadStream.end(req.file.buffer);
        });

        report.photos.push({
          url: result.secure_url,
          publicId: result.public_id,
        });
        await report.save();
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
      }
    }

    res.status(201).json({
      success: true,
      report: await serializeReport(report),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const confirmReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    const alreadyConfirmed = report.confirmations.some((confirmation) => String(confirmation.userId) === String(req.user.id));
    if (alreadyConfirmed) {
      return res.status(400).json({ success: false, message: 'You already confirmed this report' });
    }

    report.confirmations.push({
      userId: req.user.id,
      confirmedAt: new Date().toISOString(),
    });
    report.priority = report.confirmations.length;
    if (report.confirmations.length >= 3) {
      report.status = 'confirmed';
    }

    await report.save();

    res.status(200).json({
      success: true,
      message: 'Report confirmed',
      report: await serializeReport(report),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['reported', 'confirmed', 'in_progress', 'resolved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const report = await Report.update(req.params.id, {
      status,
      assignedOfficer: req.user.id,
    });

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    res.status(200).json({
      success: true,
      report: await serializeReport(report),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadAfterPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a photo' });
    }

    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'cleancity/after-photos',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(req.file.buffer);
    });

    report.afterPhotos.push({
      url: result.secure_url,
      publicId: result.public_id,
    });
    report.status = 'resolved';
    report.resolvedBy = req.user.id;
    report.resolvedAt = new Date().toISOString();

    await report.save();

    res.status(200).json({
      success: true,
      message: 'After photo uploaded successfully',
      report: await serializeReport(report),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const db = getDb();
    const totalReports = db.prepare('SELECT COUNT(*) AS total FROM reports').get().total;
    const resolvedReports = db.prepare("SELECT COUNT(*) AS total FROM reports WHERE status = 'resolved'").get().total;
    const inProgressReports = db.prepare("SELECT COUNT(*) AS total FROM reports WHERE status = 'in_progress'").get().total;
    const confirmedReports = db.prepare("SELECT COUNT(*) AS total FROM reports WHERE status = 'confirmed'").get().total;

    const reportsByCategory = db.prepare('SELECT category AS _id, COUNT(*) AS count FROM reports GROUP BY category').all();
    const reportsByStatus = db.prepare('SELECT status AS _id, COUNT(*) AS count FROM reports GROUP BY status').all();

    res.status(200).json({
      success: true,
      analytics: {
        totalReports,
        resolvedReports,
        inProgressReports,
        confirmedReports,
        resolutionRate: totalReports > 0 ? ((resolvedReports / totalReports) * 100).toFixed(2) : 0,
        reportsByCategory,
        reportsByStatus,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
