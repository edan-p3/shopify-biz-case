import { Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AuthRequest, APIResponse } from '../types/api';
import { AppError } from '../middleware/errorHandler';
import calculationService from '../services/calculationService';
import cacheService from '../services/cacheService';
import logger from '../utils/logger';

class BusinessCaseController {
  /**
   * Get all business cases with pagination and filtering
   */
  async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const {
        page = 1,
        limit = 20,
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

      const response: APIResponse = {
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
          requestId: req.headers['x-request-id'] as string,
        },
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a single business case by ID
   */
  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Check cache first
      const cached = await cacheService.getBusinessCase(id);
      if (cached) {
        logger.debug(`Business case ${id} served from cache`);
        return res.json({
          success: true,
          data: cached,
          meta: {
            timestamp: new Date().toISOString(),
            requestId: req.headers['x-request-id'] as string,
          },
        });
      }

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
        throw new AppError(
          404,
          'BUSINESS_CASE_NOT_FOUND',
          `Business case with ID ${id} not found`
        );
      }

      // Cache the result
      await cacheService.cacheBusinessCase(id, businessCase);

      const response: APIResponse = {
        success: true,
        data: businessCase,
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
   * Create a new business case with default scenarios
   */
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const {
        companyName,
        currentRevenue,
        currentPlatform,
        industry,
        grossMargin = 0.30,
        discountRate = 0.10,
        implementationCost = 50000,
        currentPlatformCosts, // { licenseFees, hosting, maintenance, thirdPartyApps }
        shopifyPlatformCosts, // { plan, apps }
        operationalCosts, // For schema compatibility
      } = req.body;

      // Calculate total current platform cost for schema
      const currentPlatformCost = 
        currentPlatformCosts.licenseFees +
        currentPlatformCosts.hosting +
        currentPlatformCosts.maintenance +
        currentPlatformCosts.thirdPartyApps;

      // Create business case with scenarios
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
          createdById: req.user?.id,
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
              const growthRates = calculationService.generateDefaultGrowthRates(
                type as any
              );
              const assumptions = calculationService.generateDefaultAssumptions(
                type as any
              );

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
                type: type as 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE',
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
            create: this.getDefaultImplementationTimeline(implementationCost),
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

      logger.info('Business case created', {
        businessCaseId: businessCase.id,
        companyName,
        userId: req.user?.id,
      });

      const response: APIResponse = {
        success: true,
        data: businessCase,
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
   * Update a business case
   */
  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const businessCase = await prisma.businessCase.update({
        where: { id },
        data: updateData,
        include: {
          scenarios: true,
        },
      });

      // Invalidate cache
      await cacheService.invalidateBusinessCase(id);

      logger.info('Business case updated', {
        businessCaseId: id,
        userId: req.user?.id,
      });

      const response: APIResponse = {
        success: true,
        data: businessCase,
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
   * Delete (archive) a business case
   */
  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Soft delete by setting status to ARCHIVED
      await prisma.businessCase.update({
        where: { id },
        data: { status: 'ARCHIVED' },
      });

      // Invalidate cache
      await cacheService.invalidateBusinessCase(id);

      logger.info('Business case archived', {
        businessCaseId: id,
        userId: req.user?.id,
      });

      const response: APIResponse = {
        success: true,
        data: { message: 'Business case archived successfully' },
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
   * Get default implementation timeline
   */
  private getDefaultImplementationTimeline(totalCost: number) {
    const phases = [
      {
        phaseNumber: 1,
        name: 'Discovery & Planning',
        duration: 2,
        startWeek: 1,
        endWeek: 2,
        description: 'Requirements gathering, stakeholder alignment, and project planning',
        deliverables: [
          'Project charter',
          'Technical requirements document',
          'Implementation roadmap',
        ],
        cost: totalCost * 0.10,
        milestones: {
          create: [
            {
              name: 'Kickoff meeting completed',
              dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
          ],
        },
      },
      {
        phaseNumber: 2,
        name: 'Platform Setup & Configuration',
        duration: 3,
        startWeek: 3,
        endWeek: 5,
        description: 'Shopify store setup, theme selection, and basic configuration',
        deliverables: [
          'Store structure',
          'Theme customization',
          'Product catalog setup',
        ],
        cost: totalCost * 0.15,
        milestones: {
          create: [
            {
              name: 'Store setup completed',
              dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
            },
          ],
        },
      },
      {
        phaseNumber: 3,
        name: 'Data Migration',
        duration: 4,
        startWeek: 6,
        endWeek: 9,
        description: 'Migrate products, customers, and historical data',
        deliverables: [
          'Data migration plan',
          'Migrated product catalog',
          'Customer data import',
        ],
        cost: totalCost * 0.25,
        milestones: {
          create: [
            {
              name: 'Data migration completed',
              dueDate: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000),
            },
          ],
        },
      },
      {
        phaseNumber: 4,
        name: 'Integration Development',
        duration: 4,
        startWeek: 10,
        endWeek: 13,
        description: 'Integrate with ERP, CRM, and other critical systems',
        deliverables: [
          'API integrations',
          'Payment gateway setup',
          'Third-party app configuration',
        ],
        cost: totalCost * 0.30,
        milestones: {
          create: [
            {
              name: 'Core integrations live',
              dueDate: new Date(Date.now() + 70 * 24 * 60 * 60 * 1000),
            },
          ],
        },
      },
      {
        phaseNumber: 5,
        name: 'Testing & Training',
        duration: 3,
        startWeek: 14,
        endWeek: 16,
        description: 'UAT, performance testing, and team training',
        deliverables: [
          'Test results',
          'Training materials',
          'User documentation',
        ],
        cost: totalCost * 0.12,
        milestones: {
          create: [
            {
              name: 'UAT sign-off',
              dueDate: new Date(Date.now() + 98 * 24 * 60 * 60 * 1000),
            },
          ],
        },
      },
      {
        phaseNumber: 6,
        name: 'Go-Live & Optimization',
        duration: 2,
        startWeek: 17,
        endWeek: 18,
        description: 'Production launch and post-launch optimization',
        deliverables: [
          'Production launch',
          'Performance monitoring',
          'Optimization recommendations',
        ],
        cost: totalCost * 0.08,
        milestones: {
          create: [
            {
              name: 'Production go-live',
              dueDate: new Date(Date.now() + 119 * 24 * 60 * 60 * 1000),
            },
          ],
        },
      },
    ];

    return phases;
  }
}

export default new BusinessCaseController();
