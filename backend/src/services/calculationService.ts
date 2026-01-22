import {
  calculateRevenueProjection,
  calculateROI,
  calculateCashFlow,
  calculateTCO,
  calculateGrossProfit,
  calculateNetBenefit,
} from '../utils/calculations';
import {
  YearlyProjectionData,
  MonthlyCashFlowData,
  ROIMetrics,
  TCOComparison,
  ScenarioAssumptionsInput,
} from '../types/models';

class CalculationService {
  /**
   * Calculate complete scenario metrics
   */
  calculateScenarioMetrics(
    baseRevenue: number,
    grossMargin: number,
    implementationCost: number,
    growthRates: [number, number, number],
    discountRate: number,
    currentPlatformCost: number,
    operationalCosts: {
      revenueLeakage: number;
      operationalInefficiency: number;
      integrationMaintenance: number;
      manualProcessing: number;
    }
  ) {
    // Calculate revenue projections
    const revenueProjections = calculateRevenueProjection(
      baseRevenue,
      growthRates,
      3
    );

    // Calculate gross profit for each year
    const grossProfitReturns = revenueProjections
      .slice(1) // Skip year 0
      .map((proj) => calculateGrossProfit(proj.revenue, grossMargin));

    // Update projections with gross profit
    revenueProjections.forEach((proj, index) => {
      if (index > 0) {
        proj.grossProfit = grossProfitReturns[index - 1];
      }
    });

    // Calculate costs (Shopify platform costs)
    const shopifyPlatformCost = currentPlatformCost * 0.6; // Assume 40% reduction
    const platformCosts = [shopifyPlatformCost, shopifyPlatformCost, shopifyPlatformCost];

    // Calculate ROI metrics
    const roiMetrics = calculateROI(
      grossProfitReturns,
      implementationCost,
      discountRate
    );

    // Calculate cash flow
    const cashFlowMonthly = calculateCashFlow(
      [implementationCost],
      platformCosts,
      grossProfitReturns,
      36
    );

    // Calculate net benefit
    const totalReturns = grossProfitReturns.reduce((sum, val) => sum + val, 0);
    const netBenefit = calculateNetBenefit(totalReturns, implementationCost);

    // Calculate TCO
    const tcoComparison = calculateTCO(
      currentPlatformCost,
      operationalCosts,
      shopifyPlatformCost,
      implementationCost,
      3
    );

    return {
      revenueProjections,
      cashFlowMonthly,
      roiMetrics,
      netBenefit,
      tcoComparison,
    };
  }

  /**
   * Generate default scenario assumptions based on type
   */
  generateDefaultAssumptions(
    scenarioType: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE'
  ): ScenarioAssumptionsInput {
    const baseAssumptions = {
      CONSERVATIVE: {
        desktopConversionRate: 0.028,
        mobileConversionRate: 0.018,
        cartAbandonmentRate: 0.70,
        cartRecoveryRate: 0.10,
        averageOrderValue: 85,
        aovGrowthRate: 0.05,
        repeatPurchaseRate: 0.25,
        customerLifetimeOrders: 3.2,
        b2bDigitalPenetration: 0.25,
        b2bOrderFrequencyIncrease: 0.15,
      },
      MODERATE: {
        desktopConversionRate: 0.032,
        mobileConversionRate: 0.022,
        cartAbandonmentRate: 0.68,
        cartRecoveryRate: 0.15,
        averageOrderValue: 95,
        aovGrowthRate: 0.08,
        repeatPurchaseRate: 0.32,
        customerLifetimeOrders: 4.1,
        b2bDigitalPenetration: 0.35,
        b2bOrderFrequencyIncrease: 0.25,
      },
      AGGRESSIVE: {
        desktopConversionRate: 0.038,
        mobileConversionRate: 0.028,
        cartAbandonmentRate: 0.65,
        cartRecoveryRate: 0.20,
        averageOrderValue: 110,
        aovGrowthRate: 0.12,
        repeatPurchaseRate: 0.40,
        customerLifetimeOrders: 5.5,
        b2bDigitalPenetration: 0.45,
        b2bOrderFrequencyIncrease: 0.35,
      },
    };

    return baseAssumptions[scenarioType];
  }

  /**
   * Generate default growth rates based on scenario type
   */
  generateDefaultGrowthRates(
    scenarioType: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE'
  ): [number, number, number] {
    const growthRates = {
      CONSERVATIVE: [0.20, 0.20, 0.20] as [number, number, number],
      MODERATE: [0.25, 0.25, 0.25] as [number, number, number],
      AGGRESSIVE: [0.35, 0.30, 0.25] as [number, number, number],
    };

    return growthRates[scenarioType];
  }

  /**
   * Perform sensitivity analysis on a variable
   */
  performSensitivityAnalysis(
    baseMetrics: {
      revenue: number;
      grossMargin: number;
      implementationCost: number;
      discountRate: number;
      currentPlatformCost: number;
      operationalCosts: any;
    },
    variable: 'growthRate' | 'conversionRate' | 'averageOrderValue',
    minPercent: number,
    maxPercent: number,
    steps: number
  ) {
    const results = [];
    const stepSize = (maxPercent - minPercent) / (steps - 1);

    for (let i = 0; i < steps; i++) {
      const percent = minPercent + stepSize * i;
      const multiplier = 1 + percent / 100;

      let modifiedMetrics = { ...baseMetrics };

      // Modify the variable based on type
      if (variable === 'growthRate') {
        const baseGrowthRate = 0.25;
        const newGrowthRate = baseGrowthRate * multiplier;
        const growthRates: [number, number, number] = [
          newGrowthRate,
          newGrowthRate,
          newGrowthRate,
        ];

        const scenarioMetrics = this.calculateScenarioMetrics(
          modifiedMetrics.revenue,
          modifiedMetrics.grossMargin,
          modifiedMetrics.implementationCost,
          growthRates,
          modifiedMetrics.discountRate,
          modifiedMetrics.currentPlatformCost,
          modifiedMetrics.operationalCosts
        );

        results.push({
          value: Math.round(newGrowthRate * 100),
          roi3Year: scenarioMetrics.roiMetrics.roi3Year,
          paybackPeriod: scenarioMetrics.roiMetrics.paybackPeriod,
          npv: scenarioMetrics.roiMetrics.npv,
        });
      } else if (variable === 'averageOrderValue') {
        // This would affect revenue calculations
        const modifiedRevenue = modifiedMetrics.revenue * multiplier;

        const scenarioMetrics = this.calculateScenarioMetrics(
          modifiedRevenue,
          modifiedMetrics.grossMargin,
          modifiedMetrics.implementationCost,
          [0.25, 0.25, 0.25],
          modifiedMetrics.discountRate,
          modifiedMetrics.currentPlatformCost,
          modifiedMetrics.operationalCosts
        );

        results.push({
          value: Math.round(modifiedRevenue),
          roi3Year: scenarioMetrics.roiMetrics.roi3Year,
          paybackPeriod: scenarioMetrics.roiMetrics.paybackPeriod,
          npv: scenarioMetrics.roiMetrics.npv,
        });
      }
    }

    return {
      variable,
      scenarios: results,
    };
  }
}

export default new CalculationService();
