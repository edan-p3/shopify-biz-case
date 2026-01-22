import { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from '../../../../backend/src/config/database';
import { createRiskSchema } from '../../../../backend/src/utils/validation';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      error: { code: 'INVALID_ID', message: 'Business case ID is required' },
    });
  }

  try {
    if (req.method === 'GET') {
      const risks = await prisma.risk.findMany({
        where: { businessCaseId: id },
        orderBy: { createdAt: 'desc' },
      });

      return res.status(200).json({
        success: true,
        data: risks,
        meta: { timestamp: new Date().toISOString() },
      });
    }

    if (req.method === 'POST') {
      const { error, value } = createRiskSchema.validate(req.body);

      if (error) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Validation failed',
            details: error.details.map((d) => ({
              field: d.path.join('.'),
              message: d.message,
            })),
          },
        });
      }

      const risk = await prisma.risk.create({
        data: {
          businessCaseId: id,
          ...value,
        },
      });

      return res.status(201).json({
        success: true,
        data: risk,
        meta: { timestamp: new Date().toISOString() },
      });
    }

    return res.status(405).json({
      success: false,
      error: { code: 'METHOD_NOT_ALLOWED', message: `Method ${req.method} not allowed` },
    });
  } catch (error: any) {
    console.error('Error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' },
    });
  }
}
