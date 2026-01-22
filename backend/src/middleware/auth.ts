import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/env';
import { AuthRequest } from '../types/api';
import { AppError } from './errorHandler';

export const authenticateJWT = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError(
      401,
      'AUTHENTICATION_ERROR',
      'No authentication token provided'
    );
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as {
      id: string;
      email: string;
      role: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    throw new AppError(401, 'AUTHENTICATION_ERROR', 'Invalid or expired token');
  }
};

export const authorize = (roles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(401, 'AUTHENTICATION_ERROR', 'Not authenticated');
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError(
        403,
        'AUTHORIZATION_ERROR',
        'Insufficient permissions to access this resource'
      );
    }

    next();
  };
};

export const optionalAuth = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as {
      id: string;
      email: string;
      role: string;
    };

    req.user = decoded;
  } catch (error) {
    // Token is invalid, but we continue without authentication
    // since this is optional auth
  }

  next();
};
