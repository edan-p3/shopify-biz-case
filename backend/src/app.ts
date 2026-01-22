import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import config from './config/env';
import routes from './routes';
import { requestLogger } from './middleware/requestLogger';
import { apiLimiter } from './middleware/rateLimiter';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { connectRedis } from './config/redis';
import redisClient from './config/redis';
import prisma from './config/database';
import logger from './utils/logger';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  })
);

// Compression
app.use(compression());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger);

// Rate limiting
app.use('/api', apiLimiter);

// Health check endpoint
app.get('/api/health', async (_req: Request, res: Response) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    // Check Redis connection
    const redisConnected = await redisClient.ping();

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        redis: redisConnected === 'PONG' ? 'connected' : 'disconnected',
      },
      version: '1.0.0',
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Service unavailable',
    });
  }
});

// API routes
app.use('/api', routes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Initialize connections
export async function initializeApp() {
  try {
    // Connect to Redis
    await connectRedis();
    logger.info('Redis connected successfully');

    // Test database connection
    await prisma.$connect();
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Failed to initialize app:', error);
    throw error;
  }
}

// Graceful shutdown
export async function shutdownApp() {
  try {
    await redisClient.quit();
    await prisma.$disconnect();
    logger.info('App shutdown completed');
  } catch (error) {
    logger.error('Error during shutdown:', error);
  }
}

export default app;
