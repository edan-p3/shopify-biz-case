import { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from '../../backend/src/config/database';
import calculationService from '../../backend/src/services/calculationService';
import { createBusinessCaseSchema } from '../../backend/src/utils/validation';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET - List all business cases
    if (req.method === 'GET') {
      const {
        page = '1',
        limit = '20',
        sortBy = 'createdAt',
        sortOrder = 'desc',
        status,
        companyName,
        industry,
      } = req.query;

      const skip = (Number(page) - 1) * Number(limit);
      const where: any = {};

      if (status) where.status = status;
      if (companyName) where.companyName = { contains: companyName as string, mode: 'insensitive' };
      if (industry) where.industry = industry;

      const [businessCases, total] = await Promise.all([
        prisma.businessCase.findMany({
          where,
          skip,
          take: Number(limit),
          orderBy: { [sortBy as string]: sortOrder },
          include: {
            scenarios: {
              select: {
                id: true,
                type: true,
                paybackPeriod: true,
                roi3Year: true,
                npv: true,
              },
            },
            _count: {
              select: {
                risks: true,
                scenarios: true,
              },
            },
          },
        }),
        prisma.businessCase.count({ where }),
      ]);

      const totalPages = Math.ceil(total / Number(limit));

      return res.status(200).json({
        success: true,
        data: businessCases,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages,
          hasNextPage: Number(page) < totalPages,
          hasPrevPage: Number(page) > 1,
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      });
    }

    // POST - Create new business case
    if (req.method === 'POST') {
      const { error, value } = createBusinessCaseSchema.validate(req.body);

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

      const {
        companyName,
        currentRevenue,
        currentPlatform,
        industry,
        grossMargin = 0.30,
        discountRate = 0.10,
        implementationCost = 50000,
        currentPlatformCosts, // Detailed breakdown: { licenseFees, hosting, maintenance, thirdPartyApps }
        shopifyPlatformCosts, // { plan, apps }
        operationalCosts,
      } = value;

      // Calculate total current platform cost for schema
      const currentPlatformCost = 
        currentPlatformCosts.licenseFees +
        currentPlatformCosts.hosting +
        currentPlatformCosts.maintenance +
        currentPlatformCosts.thirdPartyApps;

      const businessCase = await prisma.businessCase.create({
        data: {
          companyName,
          currentRevenue,
          currentPlatform,
          industry,
          grossMargin,
          discountRate,
          implementationCost,
          currentPlatformCost,
          operationalCosts: {
            create: operationalCosts || {
              revenueLeakage: 0,
              operationalInefficiency: 0,
              integrationMaintenance: 0,
              manualProcessing: 0,
            },
          },
          scenarios: {
            create: ['CONSERVATIVE', 'MODERATE', 'AGGRESSIVE'].map((type) => {
              const growthRates = calculationService.generateDefaultGrowthRates(type as any);
              const assumptions = calculationService.generateDefaultAssumptions(type as any);
              const metrics = calculationService.calculateScenarioMetrics(
                currentRevenue,
                grossMargin,
                implementationCost,
                growthRates,
                discountRate,
                currentPlatformCosts,
                shopifyPlatformCosts
              );

              return {
                type,
                year1GrowthRate: growthRates[0],
                year2GrowthRate: growthRates[1],
                year3GrowthRate: growthRates[2],
                paybackPeriod: metrics.roiMetrics.paybackPeriod,
                roi3Year: metrics.roiMetrics.roi3Year,
                npv: metrics.roiMetrics.npv,
                netBenefit: metrics.netBenefit,
                assumptions: {
                  create: assumptions,
                },
                revenueProjections: {
                  create: metrics.revenueProjections.map((proj) => ({
                    year: proj.year,
                    revenue: proj.revenue,
                    costs: proj.costs || 0,
                    grossProfit: proj.grossProfit,
                    netCashFlow: proj.netCashFlow,
                  })),
                },
                cashFlowMonthly: {
                  create: metrics.cashFlowMonthly.map((cf) => ({
                    month: cf.month,
                    investment: cf.investment,
                    platformCosts: cf.platformCosts,
                    returns: cf.returns,
                    netCashFlow: cf.netCashFlow,
                    cumulative: cf.cumulative,
                  })),
                },
              };
            }),
          },
          implementationTimeline: {
            create: getDefaultImplementationTimeline(implementationCost),
          },
        },
        include: {
          operationalCosts: true,
          scenarios: {
            include: {
              assumptions: true,
              revenueProjections: true,
              cashFlowMonthly: true,
            },
          },
          implementationTimeline: {
            include: {
              milestones: true,
            },
          },
        },
      });

      return res.status(201).json({
        success: true,
        data: businessCase,
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

function getDefaultImplementationTimeline(totalCost: number) {
  return [
    {
      phaseNumber: 1,
      name: 'Discovery & Planning',
      duration: 2,
      startWeek: 1,
      endWeek: 2,
      description: 'Requirements gathering, stakeholder alignment, and project planning',
      deliverables: ['Project charter', 'Technical requirements document', 'Implementation roadmap'],
      cost: totalCost * 0.10,
      milestones: [
        {
          name: 'Kickoff meeting completed',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      ],
    },
    {
      phaseNumber: 2,
      name: 'Platform Setup & Configuration',
      duration: 3,
      startWeek: 3,
      endWeek: 5,
      description: 'Shopify store setup, theme selection, and basic configuration',
      deliverables: ['Store structure', 'Theme customization', 'Product catalog setup'],
      cost: totalCost * 0.15,
      milestones: [
        {
          name: 'Store setup completed',
          dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        },
      ],
    },
    {
      phaseNumber: 3,
      name: 'Data Migration',
      duration: 4,
      startWeek: 6,
      endWeek: 9,
      description: 'Migrate products, customers, and historical data',
      deliverables: ['Data migration plan', 'Migrated product catalog', 'Customer data import'],
      cost: totalCost * 0.25,
      milestones: [
        {
          name: 'Data migration completed',
          dueDate: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000),
        },
      ],
    },
    {
      phaseNumber: 4,
      name: 'Integration Development',
      duration: 4,
      startWeek: 10,
      endWeek: 13,
      description: 'Integrate with ERP, CRM, and other critical systems',
      deliverables: ['API integrations', 'Payment gateway setup', 'Third-party app configuration'],
      cost: totalCost * 0.30,
      milestones: [
        {
          name: 'Core integrations live',
          dueDate: new Date(Date.now() + 70 * 24 * 60 * 60 * 1000),
        },
      ],
    },
    {
      phaseNumber: 5,
      name: 'Testing & Training',
      duration: 3,
      startWeek: 14,
      endWeek: 16,
      description: 'UAT, performance testing, and team training',
      deliverables: ['Test results', 'Training materials', 'User documentation'],
      cost: totalCost * 0.12,
      milestones: [
        {
          name: 'UAT sign-off',
          dueDate: new Date(Date.now() + 98 * 24 * 60 * 60 * 1000),
        },
      ],
    },
    {
      phaseNumber: 6,
      name: 'Go-Live & Optimization',
      duration: 2,
      startWeek: 17,
      endWeek: 18,
      description: 'Production launch and post-launch optimization',
      deliverables: ['Production launch', 'Performance monitoring', 'Optimization recommendations'],
      cost: totalCost * 0.08,
      milestones: [
        {
          name: 'Production go-live',
          dueDate: new Date(Date.now() + 119 * 24 * 60 * 60 * 1000),
        },
      ],
    },
  ];
}
