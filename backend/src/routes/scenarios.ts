import { Router } from 'express';
import scenarioController from '../controllers/scenarioController';
import { optionalAuth } from '../middleware/auth';
import {
  validateBody,
  updateScenarioSchema,
  sensitivityAnalysisSchema,
} from '../utils/validation';

const router = Router();

/**
 * @route   GET /api/business-cases/:id/scenarios
 * @desc    Get all scenarios for a business case
 * @access  Public
 */
router.get('/:id/scenarios', scenarioController.list);

/**
 * @route   GET /api/business-cases/:id/scenarios/:scenarioType
 * @desc    Get specific scenario (conservative/moderate/aggressive)
 * @access  Public
 */
router.get('/:id/scenarios/:scenarioType', scenarioController.getByType);

/**
 * @route   PUT /api/business-cases/:id/scenarios/:scenarioType
 * @desc    Update scenario assumptions and recalculate
 * @access  Public (or Protected if auth enabled)
 */
router.put(
  '/:id/scenarios/:scenarioType',
  optionalAuth,
  validateBody(updateScenarioSchema),
  scenarioController.update
);

/**
 * @route   GET /api/business-cases/:id/scenarios/:scenarioType/revenue-projections
 * @desc    Get revenue projections for scenario
 * @access  Public
 */
router.get(
  '/:id/scenarios/:scenarioType/revenue-projections',
  scenarioController.getRevenueProjections
);

/**
 * @route   GET /api/business-cases/:id/scenarios/:scenarioType/cash-flow
 * @desc    Get cash flow analysis for scenario
 * @access  Public
 */
router.get(
  '/:id/scenarios/:scenarioType/cash-flow',
  scenarioController.getCashFlow
);

/**
 * @route   GET /api/business-cases/:id/scenarios/:scenarioType/roi
 * @desc    Get ROI metrics for scenario
 * @access  Public
 */
router.get('/:id/scenarios/:scenarioType/roi', scenarioController.getROI);

/**
 * @route   POST /api/business-cases/:id/scenarios/:scenarioType/sensitivity-analysis
 * @desc    Run sensitivity analysis on key variables
 * @access  Public
 */
router.post(
  '/:id/scenarios/:scenarioType/sensitivity-analysis',
  validateBody(sensitivityAnalysisSchema),
  scenarioController.sensitivityAnalysis
);

export default router;
