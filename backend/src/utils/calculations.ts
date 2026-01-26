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
 * Based on ACTUAL COST SAVINGS, not revenue attribution
 * 
 * ROI Formula: ((Total Savings - Total Investment) / Total Investment) × 100
 * This gives the percentage return on the total 3-year investment
 * 
 * NPV is calculated differently - implementation cost upfront, then net annual savings
 */
export function calculateROI(
  annualSavings: number[],
  totalInvestment: number,
  implementationCost: number,
  discountRate: number = 0.10
): ROIMetrics {
  // Calculate 3-year total savings
  const totalSavings = annualSavings.reduce((sum, val) => sum + val, 0);
  
  // Net benefit = Total savings - Total investment
  const netBenefit = totalSavings - totalInvestment;
  
  // ROI = (Net Benefit / Total Investment) × 100
  // Example: ($825k savings - $755k investment) / $755k = 9.27%
  const roi3Year = (netBenefit / totalInvestment) * 100;

  // Calculate payback period (in months)
  const paybackPeriod = calculatePaybackPeriod(annualSavings, totalInvestment);

  // Calculate Net Present Value (NPV) - uses ONLY implementation cost as upfront
  // Annual savings already net out the new platform costs
  const npv = calculateNPV(annualSavings, implementationCost, discountRate);

  // Calculate Internal Rate of Return (IRR)
  const irr = calculateIRR([-totalInvestment, ...annualSavings]);

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
 * 
 * CORRECT NPV APPROACH FOR PLATFORM MIGRATION:
 * Year 0: -Implementation Cost (upfront payment)
 * Year 1-3: Net Annual Savings (Current Costs - New Costs)
 * 
 * This properly reflects that:
 * - Implementation is a one-time upfront cost
 * - Each year, you SAVE money (old costs - new costs)
 * - Platform fees are already subtracted in the savings calculation
 */
function calculateNPV(
  annualNetSavings: number[],
  implementationCost: number,
  discountRate: number
): number {
  // Start with negative implementation cost (paid at Year 0)
  let npv = -implementationCost;

  // Add discounted annual savings
  annualNetSavings.forEach((saving, index) => {
    const year = index + 1;
    npv += saving / Math.pow(1 + discountRate, year);
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
 * Based on ACTUAL COST SAVINGS (Current costs - New costs)
 */
export function calculateCashFlow(
  implementationCost: number,
  currentAnnualCosts: number,
  newAnnualCosts: number,
  timelineMonths: number = 36,
  implementationMonths: number = 4
): MonthlyCashFlowData[] {
  const cashFlows: MonthlyCashFlowData[] = [];
  let cumulative = 0;
  
  // Calculate monthly values
  const monthlyImplementation = implementationCost / implementationMonths;
  const monthlySavings = (currentAnnualCosts - newAnnualCosts) / 12;

  for (let month = 1; month <= timelineMonths; month++) {
    // Implementation costs (front-loaded in first few months)
    const investment = month <= implementationMonths ? monthlyImplementation : 0;

    // New platform costs (monthly)
    const platformCost = newAnnualCosts / 12;

    // Cost savings (old costs - new costs)
    const returns = currentAnnualCosts / 12;

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
 * Returns actual cost savings, not revenue attribution
 */
export function calculateTCO(
  currentPlatformCost: number,
  currentMaintenanceCost: number,
  current3rdPartyApps: number,
  currentHosting: number,
  shopifyPlanCost: number,
  shopifyAppsCost: number,
  implementationCost: number,
  years: number = 3
): TCOComparison {
  // Current state total annual costs
  const currentAnnualTotal =
    currentPlatformCost +
    currentMaintenanceCost +
    current3rdPartyApps +
    currentHosting;

  // Shopify annual costs (plan + apps, hosting included)
  const shopifyAnnualTotal = shopifyPlanCost + shopifyAppsCost;

  // Annual savings
  const annualSavings = currentAnnualTotal - shopifyAnnualTotal;

  const currentState = {
    year1: currentAnnualTotal,
    year2: currentAnnualTotal,
    year3: currentAnnualTotal,
    total: currentAnnualTotal * years,
  };

  const shopifyState = {
    year1: implementationCost + shopifyAnnualTotal,
    year2: shopifyAnnualTotal,
    year3: shopifyAnnualTotal,
    total: implementationCost + (shopifyAnnualTotal * years),
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
