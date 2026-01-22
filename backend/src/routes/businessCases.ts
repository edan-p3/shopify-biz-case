import { Router } from 'express';
import businessCaseController from '../controllers/businessCaseController';
import { optionalAuth } from '../middleware/auth';
import {
  validateBody,
  validateQuery,
  createBusinessCaseSchema,
  updateBusinessCaseSchema,
  businessCaseListQuerySchema,
} from '../utils/validation';

const router = Router();

/**
 * @route   GET /api/business-cases
 * @desc    List all business cases
 * @access  Public (with optional auth)
 */
router.get(
  '/',
  optionalAuth,
  validateQuery(businessCaseListQuerySchema),
  businessCaseController.list
);

/**
 * @route   GET /api/business-cases/:id
 * @desc    Get business case by ID
 * @access  Public
 */
router.get('/:id', businessCaseController.getById);

/**
 * @route   POST /api/business-cases
 * @desc    Create new business case
 * @access  Public (or Protected if auth enabled)
 */
router.post(
  '/',
  optionalAuth,
  validateBody(createBusinessCaseSchema),
  businessCaseController.create
);

/**
 * @route   PUT /api/business-cases/:id
 * @desc    Update business case
 * @access  Public (or Protected if auth enabled)
 */
router.put(
  '/:id',
  optionalAuth,
  validateBody(updateBusinessCaseSchema),
  businessCaseController.update
);

/**
 * @route   DELETE /api/business-cases/:id
 * @desc    Archive business case
 * @access  Public (or Protected if auth enabled)
 */
router.delete('/:id', optionalAuth, businessCaseController.delete);

export default router;
