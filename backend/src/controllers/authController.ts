import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import config from '../config/env';
import { APIResponse } from '../types/api';
import { AppError } from '../middleware/errorHandler';
import logger from '../utils/logger';

class AuthController {
  /**
   * Register a new user
   */
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, firstName, lastName, company } = req.body;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new AppError(
          409,
          'VALIDATION_ERROR',
          'User with this email already exists'
        );
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          firstName,
          lastName,
          company,
          role: 'VIEWER', // Default role
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          company: true,
          role: true,
          createdAt: true,
        },
      });

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn }
      );

      logger.info('User registered', { userId: user.id, email });

      const response: APIResponse = {
        success: true,
        data: {
          user,
          token,
        },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: req.headers['x-request-id'] as string,
        },
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login user
   */
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new AppError(
          401,
          'AUTHENTICATION_ERROR',
          'Invalid email or password'
        );
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);

      if (!isValidPassword) {
        throw new AppError(
          401,
          'AUTHENTICATION_ERROR',
          'Invalid email or password'
        );
      }

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      });

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn }
      );

      logger.info('User logged in', { userId: user.id, email });

      const response: APIResponse = {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            company: user.company,
            role: user.role,
          },
          token,
        },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: req.headers['x-request-id'] as string,
        },
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current user profile
   */
  async getProfile(req: any, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          company: true,
          role: true,
          createdAt: true,
          lastLogin: true,
        },
      });

      if (!user) {
        throw new AppError(
          404,
          'BUSINESS_CASE_NOT_FOUND',
          'User not found'
        );
      }

      const response: APIResponse = {
        success: true,
        data: user,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: req.headers['x-request-id'] as string,
        },
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
