import { Router } from 'express';
import exportController from '../controllers/exportController';
import { optionalAuth } from '../middleware/auth';
import { exportLimiter } from '../middleware/rateLimiter';
import {
  validateBody,
  exportRequestSchema,
  shareRequestSchema,
} from '../utils/validation';

const router = Router();

/**
 * @route   POST /api/business-cases/:id/export
 * @desc    Generate export (PDF, Excel, JSON)
 * @access  Public (rate limited)
 */
router.post(
  '/:id/export',
  optionalAuth,
  exportLimiter,
  validateBody(exportRequestSchema),
  exportController.generateExport
);

/**
 * @route   GET /api/exports/:jobId
 * @desc    Get export job status
 * @access  Public
 */
router.get('/:jobId', exportController.getExportStatus);

/**
 * @route   GET /api/exports/:jobId/download
 * @desc    Download completed export
 * @access  Public
 */
router.get('/:jobId/download', exportController.downloadExport);

/**
 * @route   POST /api/business-cases/:id/share
 * @desc    Generate shareable link
 * @access  Public (or Protected if auth enabled)
 */
router.post(
  '/:id/share',
  optionalAuth,
  validateBody(shareRequestSchema),
  exportController.generateShareLink
);

export default router;
