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
   * Based on ACTUAL COST SAVINGS, not revenue attribution
   */
  calculateScenarioMetrics(
    baseRevenue: number,
    grossMargin: number,
    implementationCost: number,
    growthRates: [number, number, number],
    discountRate: number,
    currentPlatformCosts: {
      licenseFees: number;
      hosting: number;
      maintenance: number;
      thirdPartyApps: number;
    },
    shopifyPlatformCosts: {
      plan: number;
      apps: number;
    }
  ) {
    // Calculate current annual costs
    const currentAnnualCosts =
      currentPlatformCosts.licenseFees +
      currentPlatformCosts.hosting +
      currentPlatformCosts.maintenance +
      currentPlatformCosts.thirdPartyApps;

    // Calculate Shopify annual costs
    const shopifyAnnualCosts = shopifyPlatformCosts.plan + shopifyPlatformCosts.apps;

    // Calculate annual savings (this is the ACTUAL benefit)
    const annualSavings = currentAnnualCosts - shopifyAnnualCosts;
    const savingsArray = [annualSavings, annualSavings, annualSavings]; // 3 years

    // Calculate total 3-year investment (implementation + 3 years of platform costs)
    const total3YearInvestment = implementationCost + (shopifyAnnualCosts * 3);
    
    // Calculate total 3-year savings
    const total3YearSavings = annualSavings * 3;

    // Calculate revenue projections (for display purposes only, not for ROI)
    const revenueProjections = calculateRevenueProjection(
      baseRevenue,
      growthRates,
      3
    );

    // Update projections with costs and savings
    revenueProjections.forEach((proj, index) => {
      if (index === 0) {
        proj.costs = currentAnnualCosts;
      } else {
        proj.costs = shopifyAnnualCosts;
        proj.grossProfit = annualSavings; // Annual savings
      }
    });

    // Calculate ROI metrics based on NET SAVINGS vs TOTAL INVESTMENT
    const roiMetrics = calculateROI(
      savingsArray,
      total3YearInvestment,
      implementationCost,
      discountRate
    );

    // Calculate cash flow based on savings
    const cashFlowMonthly = calculateCashFlow(
      implementationCost,
      currentAnnualCosts,
      shopifyAnnualCosts,
      36,
      4 // 4 month implementation
    );

    // Calculate net benefit (total savings - total investment)
    const netBenefit = calculateNetBenefit(total3YearSavings, total3YearInvestment);

    // Calculate TCO
    const tcoComparison = calculateTCO(
      currentPlatformCosts.licenseFees,
      currentPlatformCosts.maintenance,
      currentPlatformCosts.thirdPartyApps,
      currentPlatformCosts.hosting,
      shopifyPlatformCosts.plan,
      shopifyPlatformCosts.apps,
      implementationCost,
      3
    );

    return {
      revenueProjections,
      cashFlowMonthly,
      roiMetrics,
      netBenefit,
      tcoComparison,
      annualSavings,
      currentAnnualCosts,
      shopifyAnnualCosts,
      total3YearInvestment,
      total3YearSavings,
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
