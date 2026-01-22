import { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from '../../../../backend/src/config/database';
import calculationService from '../../../../backend/src/services/calculationService';
import { updateScenarioSchema } from '../../../../backend/src/utils/validation';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id, scenarioType } = req.query;

  if (!id || typeof id !== 'string' || !scenarioType || typeof scenarioType !== 'string') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_PARAMS',
        message: 'Business case ID and scenario type are required',
      },
    });
  }

  try {
    // GET - Get scenario
    if (req.method === 'GET') {
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
        return res.status(404).json({
          success: false,
          error: {
            code: 'INVALID_SCENARIO_TYPE',
            message: `Scenario ${scenarioType} not found for business case ${id}`,
          },
        });
      }

      return res.status(200).json({
        success: true,
        data: scenario,
        meta: {
          timestamp: new Date().toISOString(),
        },
      });
    }

    // PUT - Update scenario
    if (req.method === 'PUT') {
      const { error, value } = updateScenarioSchema.validate(req.body);

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

      const { year1GrowthRate, year2GrowthRate, year3GrowthRate, assumptions } = value;

      // Get business case details
      const businessCase = await prisma.businessCase.findUnique({
        where: { id },
        include: {
          operationalCosts: true,
        },
      });

      if (!businessCase) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'BUSINESS_CASE_NOT_FOUND',
            message: `Business case ${id} not found`,
          },
        });
      }

      const scenario = await prisma.scenario.findFirst({
        where: {
          businessCaseId: id,
          type: scenarioType.toUpperCase() as any,
        },
      });

      if (!scenario) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'INVALID_SCENARIO_TYPE',
            message: `Scenario ${scenarioType} not found`,
          },
        });
      }

      const growthRates: [number, number, number] = [
        year1GrowthRate ?? scenario.year1GrowthRate,
        year2GrowthRate ?? scenario.year2GrowthRate,
        year3GrowthRate ?? scenario.year3GrowthRate,
      ];

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

      // Update projections
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

      return res.status(200).json({
        success: true,
        data: updatedScenario,
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
