import {
  YearlyProjectionData,
  MonthlyCashFlowData,
  ROIMetrics,
  TCOComparison,
  ConversionImpact,
  AbandonedCartRecovery,
} from '../types/models';

/**
 * Calculate revenue projection for multiple years
 */
export function calculateRevenueProjection(
  baseRevenue: number,
  growthRates: number[],
  years: number = 3
): YearlyProjectionData[] {
  const projections: YearlyProjectionData[] = [];
  let currentRevenue = baseRevenue;

  // Year 0 (current state)
  projections.push({
    year: 0,
    revenue: baseRevenue,
    costs: 0,
    grossProfit: 0,
    netCashFlow: 0,
  });

  // Future years
  for (let i = 0; i < years; i++) {
    currentRevenue = currentRevenue * (1 + growthRates[i]);
    projections.push({
      year: i + 1,
      revenue: currentRevenue,
      costs: 0, // Will be calculated separately
      grossProfit: 0, // Will be calculated separately
      netCashFlow: 0, // Will be calculated separately
    });
  }

  return projections;
}

/**
 * Calculate ROI metrics including payback period, NPV, and IRR
 */
export function calculateROI(
  grossProfitReturns: number[],
  totalInvestment: number,
  discountRate: number = 0.10
): ROIMetrics {
  // Calculate 3-year total ROI
  const totalReturns = grossProfitReturns.reduce((sum, val) => sum + val, 0);
  const roi3Year = ((totalReturns - totalInvestment) / totalInvestment) * 100;

  // Calculate payback period (in months)
  const paybackPeriod = calculatePaybackPeriod(grossProfitReturns, totalInvestment);

  // Calculate Net Present Value (NPV)
  const npv = calculateNPV(grossProfitReturns, totalInvestment, discountRate);

  // Calculate Internal Rate of Return (IRR)
  const irr = calculateIRR([-totalInvestment, ...grossProfitReturns]);

  return {
    roi3Year: Math.round(roi3Year * 100) / 100,
    paybackPeriod: Math.round(paybackPeriod * 10) / 10,
    npv: Math.round(npv),
    irr: Math.round(irr * 10000) / 10000,
  };
}

/**
 * Calculate payback period in months
 */
function calculatePaybackPeriod(returns: number[], investment: number): number {
  const monthlyReturns = returns.map((annual) => annual / 12);
  let cumulative = 0;
  let months = 0;

  for (let i = 0; i < monthlyReturns.length * 12; i++) {
    const yearIndex = Math.floor(i / 12);
    cumulative += monthlyReturns[yearIndex];
    months++;

    if (cumulative >= investment) {
      // Interpolate for more precise payback period
      const previousCumulative = cumulative - monthlyReturns[yearIndex];
      const fraction = (investment - previousCumulative) / monthlyReturns[yearIndex];
      return months - 1 + fraction;
    }
  }

  return months; // If not paid back within period
}

/**
 * Calculate Net Present Value
 */
function calculateNPV(
  cashFlows: number[],
  initialInvestment: number,
  discountRate: number
): number {
  let npv = -initialInvestment;

  cashFlows.forEach((cashFlow, index) => {
    const year = index + 1;
    npv += cashFlow / Math.pow(1 + discountRate, year);
  });

  return npv;
}

/**
 * Calculate Internal Rate of Return using Newton-Raphson method
 */
function calculateIRR(cashFlows: number[], guess: number = 0.1): number {
  const maxIterations = 100;
  const tolerance = 0.0001;
  let rate = guess;

  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let dnpv = 0;

    cashFlows.forEach((cashFlow, period) => {
      npv += cashFlow / Math.pow(1 + rate, period);
      dnpv -= (period * cashFlow) / Math.pow(1 + rate, period + 1);
    });

    const newRate = rate - npv / dnpv;

    if (Math.abs(newRate - rate) < tolerance) {
      return newRate;
    }

    rate = newRate;
  }

  return rate;
}

/**
 * Calculate monthly cash flow for a given period
 */
export function calculateCashFlow(
  implementationCosts: number[],
  platformCosts: number[],
  grossProfitReturns: number[],
  timelineMonths: number = 36
): MonthlyCashFlowData[] {
  const cashFlows: MonthlyCashFlowData[] = [];
  let cumulative = 0;

  for (let month = 1; month <= timelineMonths; month++) {
    const yearIndex = Math.floor((month - 1) / 12);
    const monthInYear = ((month - 1) % 12) + 1;

    // Implementation costs (typically front-loaded in first few months)
    const investment =
      yearIndex === 0 && month <= 6
        ? implementationCosts[0] / 6
        : 0;

    // Platform costs (monthly)
    const platformCost = platformCosts[yearIndex] / 12;

    // Returns (monthly gross profit)
    const returns = yearIndex < grossProfitReturns.length
      ? grossProfitReturns[yearIndex] / 12
      : 0;

    const netCashFlow = returns - investment - platformCost;
    cumulative += netCashFlow;

    cashFlows.push({
      month,
      investment: -investment,
      platformCosts: -platformCost,
      returns,
      netCashFlow,
      cumulative,
    });
  }

  return cashFlows;
}

/**
 * Calculate Total Cost of Ownership comparison
 */
export function calculateTCO(
  currentPlatformCost: number,
  currentOperationalCosts: {
    revenueLeakage: number;
    operationalInefficiency: number;
    integrationMaintenance: number;
    manualProcessing: number;
  },
  shopifyPlatformCost: number,
  implementationCost: number,
  years: number = 3
): TCOComparison {
  const currentAnnualTotal =
    currentPlatformCost +
    currentOperationalCosts.revenueLeakage +
    currentOperationalCosts.operationalInefficiency +
    currentOperationalCosts.integrationMaintenance +
    currentOperationalCosts.manualProcessing;

  // Shopify reduces operational costs significantly
  const shopifyOperationalReduction = 0.70; // 70% reduction
  const shopifyAnnualOperational =
    (currentOperationalCosts.operationalInefficiency +
      currentOperationalCosts.integrationMaintenance +
      currentOperationalCosts.manualProcessing) *
    (1 - shopifyOperationalReduction);

  const currentState = {
    year1: currentAnnualTotal,
    year2: currentAnnualTotal,
    year3: currentAnnualTotal,
    total: currentAnnualTotal * years,
  };

  const shopifyState = {
    year1: implementationCost + shopifyPlatformCost + shopifyAnnualOperational,
    year2: shopifyPlatformCost + shopifyAnnualOperational,
    year3: shopifyPlatformCost + shopifyAnnualOperational,
    total:
      implementationCost +
      (shopifyPlatformCost + shopifyAnnualOperational) * years,
  };

  const savings = {
    year1: currentState.year1 - shopifyState.year1,
    year2: currentState.year2 - shopifyState.year2,
    year3: currentState.year3 - shopifyState.year3,
    total: currentState.total - shopifyState.total,
  };

  return { currentState, shopifyState, savings };
}

/**
 * Calculate conversion rate impact on revenue
 */
export function calculateConversionImpact(
  currentConversion: number,
  newConversion: number,
  trafficVolume: number,
  averageOrderValue: number
): ConversionImpact {
  const currentOrders = trafficVolume * currentConversion;
  const newOrders = trafficVolume * newConversion;
  const additionalOrders = newOrders - currentOrders;
  const revenueImpact = additionalOrders * averageOrderValue;
  const improvementPercent =
    ((newConversion - currentConversion) / currentConversion) * 100;

  return {
    additionalOrders: Math.round(additionalOrders),
    revenueImpact: Math.round(revenueImpact),
    improvementPercent: Math.round(improvementPercent * 100) / 100,
  };
}

/**
 * Calculate abandoned cart recovery opportunity
 */
export function calculateAbandonedCartRecovery(
  revenue: number,
  abandonmentRate: number,
  recoveryRate: number
): AbandonedCartRecovery {
  const potentialRevenue = revenue / (1 - abandonmentRate) - revenue;
  const recoveredRevenue = potentialRevenue * recoveryRate;
  const lostRevenue = potentialRevenue * (1 - recoveryRate);

  return {
    potentialRevenue: Math.round(potentialRevenue),
    recoveredRevenue: Math.round(recoveredRevenue),
    lostRevenue: Math.round(lostRevenue),
  };
}

/**
 * Calculate gross profit from revenue
 */
export function calculateGrossProfit(
  revenue: number,
  grossMargin: number
): number {
  return revenue * grossMargin;
}

/**
 * Calculate net benefit (total returns - total investment)
 */
export function calculateNetBenefit(
  totalReturns: number,
  totalInvestment: number
): number {
  return totalReturns - totalInvestment;
}

/**
 * Format currency for display
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format percentage for display
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}
