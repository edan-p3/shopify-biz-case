import { Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AuthRequest, APIResponse } from '../types/api';
import { AppError } from '../middleware/errorHandler';
import calculationService from '../services/calculationService';
import cacheService from '../services/cacheService';
import logger from '../utils/logger';

class ScenarioController {
  /**
   * Get all scenarios for a business case
   */
  async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const scenarios = await prisma.scenario.findMany({
        where: { businessCaseId: id },
        include: {
          revenueProjections: {
            orderBy: { year: 'asc' },
          },
          cashFlowMonthly: {
            orderBy: { month: 'asc' },
          },
          assumptions: true,
        },
      });

      const response: APIResponse = {
        success: true,
        data: scenarios,
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
   * Get a specific scenario
   */
  async getByType(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id, scenarioType } = req.params;

      const scenario = await prisma.scenario.findFirst({
        where: {
          businessCaseId: id,
          type: scenarioType.toUpperCase() as any,
        },
        include: {
          revenueProjections: {
            orderBy: { year: 'asc' },
          },
          cashFlowMonthly: {
            orderBy: { month: 'asc' },
          },
          assumptions: true,
        },
      });

      if (!scenario) {
        throw new AppError(
          404,
          'INVALID_SCENARIO_TYPE',
          `Scenario ${scenarioType} not found for business case ${id}`
        );
      }

      const response: APIResponse = {
        success: true,
        data: scenario,
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
   * Update a scenario
   */
  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id, scenarioType } = req.params;
      const { year1GrowthRate, year2GrowthRate, year3GrowthRate, assumptions } = req.body;

      // Get business case details for recalculation
      const businessCase = await prisma.businessCase.findUnique({
        where: { id },
        include: {
          operationalCosts: true,
        },
      });

      if (!businessCase) {
        throw new AppError(
          404,
          'BUSINESS_CASE_NOT_FOUND',
          `Business case ${id} not found`
        );
      }

      // Find scenario
      const scenario = await prisma.scenario.findFirst({
        where: {
          businessCaseId: id,
          type: scenarioType.toUpperCase() as any,
        },
      });

      if (!scenario) {
        throw new AppError(
          404,
          'INVALID_SCENARIO_TYPE',
          `Scenario ${scenarioType} not found`
        );
      }

      // Use existing values if not provided
      const growthRates: [number, number, number] = [
        year1GrowthRate ?? scenario.year1GrowthRate,
        year2GrowthRate ?? scenario.year2GrowthRate,
        year3GrowthRate ?? scenario.year3GrowthRate,
      ];

      // Recalculate metrics
      const metrics = calculationService.calculateScenarioMetrics(
        businessCase.currentRevenue,
        businessCase.grossMargin,
        businessCase.implementationCost,
        growthRates,
        businessCase.discountRate,
        businessCase.currentPlatformCost,
        {
          revenueLeakage: businessCase.operationalCosts?.revenueLeakage || 0,
          operationalInefficiency: businessCase.operationalCosts?.operationalInefficiency || 0,
          integrationMaintenance: businessCase.operationalCosts?.integrationMaintenance || 0,
          manualProcessing: businessCase.operationalCosts?.manualProcessing || 0,
        }
      );

      // Update scenario
      const updatedScenario = await prisma.scenario.update({
        where: { id: scenario.id },
        data: {
          year1GrowthRate: growthRates[0],
          year2GrowthRate: growthRates[1],
          year3GrowthRate: growthRates[2],
          paybackPeriod: metrics.roiMetrics.paybackPeriod,
          roi3Year: metrics.roiMetrics.roi3Year,
          npv: metrics.roiMetrics.npv,
          netBenefit: metrics.netBenefit,
          assumptions: assumptions
            ? {
                update: assumptions,
              }
            : undefined,
        },
        include: {
          revenueProjections: true,
          cashFlowMonthly: true,
          assumptions: true,
        },
      });

      // Delete and recreate projections
      await prisma.yearlyProjection.deleteMany({
        where: { scenarioId: scenario.id },
      });

      await prisma.yearlyProjection.createMany({
        data: metrics.revenueProjections.map((proj) => ({
          scenarioId: scenario.id,
          year: proj.year,
          revenue: proj.revenue,
          costs: proj.costs || 0,
          grossProfit: proj.grossProfit,
          netCashFlow: proj.netCashFlow,
        })),
      });

      // Delete and recreate cash flow
      await prisma.monthlyCashFlow.deleteMany({
        where: { scenarioId: scenario.id },
      });

      await prisma.monthlyCashFlow.createMany({
        data: metrics.cashFlowMonthly.map((cf) => ({
          scenarioId: scenario.id,
          month: cf.month,
          investment: cf.investment,
          platformCosts: cf.platformCosts,
          returns: cf.returns,
          netCashFlow: cf.netCashFlow,
          cumulative: cf.cumulative,
        })),
      });

      // Invalidate cache
      await cacheService.invalidateBusinessCase(id);

      logger.info('Scenario updated', {
        businessCaseId: id,
        scenarioType,
        userId: req.user?.id,
      });

      const response: APIResponse = {
        success: true,
        data: updatedScenario,
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
   * Get revenue projections for a scenario
   */
  async getRevenueProjections(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id, scenarioType } = req.params;

      const scenario = await prisma.scenario.findFirst({
        where: {
          businessCaseId: id,
          type: scenarioType.toUpperCase() as any,
        },
        include: {
          revenueProjections: {
            orderBy: { year: 'asc' },
          },
        },
      });

      if (!scenario) {
        throw new AppError(
          404,
          'INVALID_SCENARIO_TYPE',
          `Scenario ${scenarioType} not found`
        );
      }

      const response: APIResponse = {
        success: true,
        data: scenario.revenueProjections,
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
   * Get cash flow for a scenario
   */
  async getCashFlow(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id, scenarioType } = req.params;

      const scenario = await prisma.scenario.findFirst({
        where: {
          businessCaseId: id,
          type: scenarioType.toUpperCase() as any,
        },
        include: {
          cashFlowMonthly: {
            orderBy: { month: 'asc' },
          },
        },
      });

      if (!scenario) {
        throw new AppError(
          404,
          'INVALID_SCENARIO_TYPE',
          `Scenario ${scenarioType} not found`
        );
      }

      const response: APIResponse = {
        success: true,
        data: scenario.cashFlowMonthly,
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
   * Get ROI metrics for a scenario
   */
  async getROI(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id, scenarioType } = req.params;

      const scenario = await prisma.scenario.findFirst({
        where: {
          businessCaseId: id,
          type: scenarioType.toUpperCase() as any,
        },
      });

      if (!scenario) {
        throw new AppError(
          404,
          'INVALID_SCENARIO_TYPE',
          `Scenario ${scenarioType} not found`
        );
      }

      const roiMetrics = {
        paybackPeriod: scenario.paybackPeriod,
        roi3Year: scenario.roi3Year,
        npv: scenario.npv,
        netBenefit: scenario.netBenefit,
      };

      const response: APIResponse = {
        success: true,
        data: roiMetrics,
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
   * Perform sensitivity analysis
   */
  async sensitivityAnalysis(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id, scenarioType } = req.params;
      const { variable, minPercent, maxPercent, steps } = req.body;

      const businessCase = await prisma.businessCase.findUnique({
        where: { id },
        include: {
          operationalCosts: true,
        },
      });

      if (!businessCase) {
        throw new AppError(
          404,
          'BUSINESS_CASE_NOT_FOUND',
          `Business case ${id} not found`
        );
      }

      const baseMetrics = {
        revenue: businessCase.currentRevenue,
        grossMargin: businessCase.grossMargin,
        implementationCost: businessCase.implementationCost,
        discountRate: businessCase.discountRate,
        currentPlatformCost: businessCase.currentPlatformCost,
        operationalCosts: {
          revenueLeakage: businessCase.operationalCosts?.revenueLeakage || 0,
          operationalInefficiency: businessCase.operationalCosts?.operationalInefficiency || 0,
          integrationMaintenance: businessCase.operationalCosts?.integrationMaintenance || 0,
          manualProcessing: businessCase.operationalCosts?.manualProcessing || 0,
        },
      };

      const analysis = calculationService.performSensitivityAnalysis(
        baseMetrics,
        variable,
        minPercent,
        maxPercent,
        steps
      );

      const response: APIResponse = {
        success: true,
        data: analysis,
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

export default new ScenarioController();
