import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import logger from '../utils/logger';
import { APIResponse, ErrorCode } from '../types/api';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: ErrorCode,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error('Error occurred:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Handle custom AppError
  if (err instanceof AppError) {
    const response: APIResponse = {
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: req.headers['x-request-id'] as string,
      },
    };

    return res.status(err.statusCode).json(response);
  }

  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    let statusCode = 400;
    let code: ErrorCode = 'VALIDATION_ERROR';
    let message = 'Database operation failed';

    switch (err.code) {
      case 'P2002':
        statusCode = 409;
        message = 'A record with this value already exists';
        break;
      case 'P2025':
        statusCode = 404;
        code = 'BUSINESS_CASE_NOT_FOUND';
        message = 'Record not found';
        break;
      case 'P2003':
        statusCode = 400;
        message = 'Foreign key constraint failed';
        break;
    }

    const response: APIResponse = {
      success: false,
      error: {
        code,
        message,
        details: err.meta,
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: req.headers['x-request-id'] as string,
      },
    };

    return res.status(statusCode).json(response);
  }

  // Handle Prisma validation errors
  if (err instanceof Prisma.PrismaClientValidationError) {
    const response: APIResponse = {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid data provided',
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: req.headers['x-request-id'] as string,
      },
    };

    return res.status(400).json(response);
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    const response: APIResponse = {
      success: false,
      error: {
        code: 'AUTHENTICATION_ERROR',
        message: 'Invalid token',
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: req.headers['x-request-id'] as string,
      },
    };

    return res.status(401).json(response);
  }

  if (err.name === 'TokenExpiredError') {
    const response: APIResponse = {
      success: false,
      error: {
        code: 'AUTHENTICATION_ERROR',
        message: 'Token expired',
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: req.headers['x-request-id'] as string,
      },
    };

    return res.status(401).json(response);
  }

  // Default error response
  const response: APIResponse = {
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId: req.headers['x-request-id'] as string,
    },
  };

  return res.status(500).json(response);
};

export const notFoundHandler = (req: Request, res: Response) => {
  const response: APIResponse = {
    success: false,
    error: {
      code: 'BUSINESS_CASE_NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId: req.headers['x-request-id'] as string,
    },
  };

  res.status(404).json(response);
};
