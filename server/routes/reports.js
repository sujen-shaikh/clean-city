import express from 'express';
import multer from 'multer';
import {
  getReports,
  getReportsNearby,
  getReport,
  createReport,
  confirmReport,
  updateReportStatus,
  uploadAfterPhoto,
  getAnalytics,
} from '../controllers/reportController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Public routes
router.get('/nearby', getReportsNearby);
router.get('/', getReports);
router.get('/:id', getReport);

// Protected routes
router.post('/', protect, upload.single('photo'), createReport);
router.post('/:id/confirm', protect, confirmReport);

// Admin/Officer routes
router.put('/:id/status', protect, authorize('admin', 'officer'), updateReportStatus);
router.post('/:id/after-photo', protect, authorize('admin', 'officer'), upload.single('photo'), uploadAfterPhoto);
router.get('/analytics/dashboard', protect, authorize('admin', 'officer'), getAnalytics);

export default router;
