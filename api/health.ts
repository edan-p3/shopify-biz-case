import { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from '../backend/src/config/database';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    return res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
      },
      version: '1.0.0',
    });
  } catch (error: any) {
    console.error('Health check failed:', error);
    return res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Service unavailable',
      details: error.message || String(error),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
}
