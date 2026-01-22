import { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from '../../backend/src/config/database';
import { updateBusinessCaseSchema } from '../../backend/src/utils/validation';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_ID',
        message: 'Business case ID is required',
      },
    });
  }

  try {
    // GET - Get business case by ID
    if (req.method === 'GET') {
      const businessCase = await prisma.businessCase.findUnique({
        where: { id },
        include: {
          operationalCosts: true,
          scenarios: {
            include: {
              revenueProjections: {
                orderBy: { year: 'asc' },
              },
              cashFlowMonthly: {
                orderBy: { month: 'asc' },
              },
              assumptions: true,
            },
          },
          risks: {
            orderBy: { createdAt: 'desc' },
          },
          implementationTimeline: {
            orderBy: { phaseNumber: 'asc' },
            include: {
              milestones: true,
            },
          },
        },
      });

      if (!businessCase) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'BUSINESS_CASE_NOT_FOUND',
            message: `Business case with ID ${id} not found`,
          },
        });
      }

      return res.status(200).json({
        success: true,
        data: businessCase,
        meta: {
          timestamp: new Date().toISOString(),
        },
      });
    }

    // PUT - Update business case
    if (req.method === 'PUT') {
      const { error, value } = updateBusinessCaseSchema.validate(req.body);

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

      const businessCase = await prisma.businessCase.update({
        where: { id },
        data: value,
        include: {
          scenarios: true,
        },
      });

      return res.status(200).json({
        success: true,
        data: businessCase,
        meta: {
          timestamp: new Date().toISOString(),
        },
      });
    }

    // DELETE - Archive business case
    if (req.method === 'DELETE') {
      await prisma.businessCase.update({
        where: { id },
        data: { status: 'ARCHIVED' },
      });

      return res.status(200).json({
        success: true,
        data: { message: 'Business case archived successfully' },
        meta: {
          timestamp: new Date().toISOString(),
        },
      });
    }

    return res.status(405).json({
      success: false,
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: `Method ${req.method} not allowed`,
      },
    });
  } catch (error: any) {
    console.error('Error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
      },
    });
  }
}
