import { Router } from 'express';
import authController from '../controllers/authController';
import { authenticateJWT } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';
import {
  validateBody,
  loginSchema,
  registerSchema,
} from '../utils/validation';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post(
  '/register',
  authLimiter,
  validateBody(registerSchema),
  authController.register
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  '/login',
  authLimiter,
  validateBody(loginSchema),
  authController.login
);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Protected
 */
router.get('/profile', authenticateJWT, authController.getProfile);

export default router;
