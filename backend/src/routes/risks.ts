import { Router } from 'express';
import riskController from '../controllers/riskController';
import { optionalAuth } from '../middleware/auth';
import {
  validateBody,
  createRiskSchema,
  updateRiskSchema,
} from '../utils/validation';

const router = Router();

/**
 * @route   GET /api/business-cases/:id/risks
 * @desc    Get all risks for a business case
 * @access  Public
 */
router.get('/:id/risks', riskController.list);

/**
 * @route   POST /api/business-cases/:id/risks
 * @desc    Create new risk
 * @access  Public (or Protected if auth enabled)
 */
router.post(
  '/:id/risks',
  optionalAuth,
  validateBody(createRiskSchema),
  riskController.create
);

/**
 * @route   PUT /api/business-cases/:id/risks/:riskId
 * @desc    Update risk
 * @access  Public (or Protected if auth enabled)
 */
router.put(
  '/:id/risks/:riskId',
  optionalAuth,
  validateBody(updateRiskSchema),
  riskController.update
);

/**
 * @route   DELETE /api/business-cases/:id/risks/:riskId
 * @desc    Delete risk
 * @access  Public (or Protected if auth enabled)
 */
router.delete('/:id/risks/:riskId', optionalAuth, riskController.delete);

/**
 * @route   GET /api/business-cases/:id/risk-matrix
 * @desc    Get risk matrix visualization data
 * @access  Public
 */
router.get('/:id/risk-matrix', riskController.getRiskMatrix);

export default router;
