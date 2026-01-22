// TypeScript types for business logic (extending Prisma types)

export interface OperationalCostsInput {
  revenueLeakage: number;
  operationalInefficiency: number;
  integrationMaintenance: number;
  manualProcessing: number;
}

export interface YearlyProjectionData {
  year: number;
  revenue: number;
  costs: number;
  grossProfit: number;
  netCashFlow: number;
}

export interface MonthlyCashFlowData {
  month: number;
  investment: number;
  platformCosts: number;
  returns: number;
  netCashFlow: number;
  cumulative: number;
}

export interface ScenarioAssumptionsInput {
  desktopConversionRate: number;
  mobileConversionRate: number;
  cartAbandonmentRate: number;
  cartRecoveryRate: number;
  averageOrderValue: number;
  aovGrowthRate: number;
  repeatPurchaseRate: number;
  customerLifetimeOrders: number;
  b2bDigitalPenetration: number;
  b2bOrderFrequencyIncrease: number;
}

export interface ImplementationPhaseInput {
  phaseNumber: number;
  name: string;
  duration: number; // weeks
  startWeek: number;
  endWeek: number;
  description: string;
  deliverables: string[];
  cost: number;
  milestones?: MilestoneInput[];
}

export interface MilestoneInput {
  name: string;
  dueDate: Date;
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';
}

export interface ROIMetrics {
  roi3Year: number;
  paybackPeriod: number; // months
  npv: number;
  irr: number;
}

export interface TCOComparison {
  currentState: {
    year1: number;
    year2: number;
    year3: number;
    total: number;
  };
  shopifyState: {
    year1: number;
    year2: number;
    year3: number;
    total: number;
  };
  savings: {
    year1: number;
    year2: number;
    year3: number;
    total: number;
  };
}

export interface ConversionImpact {
  additionalOrders: number;
  revenueImpact: number;
  improvementPercent: number;
}

export interface AbandonedCartRecovery {
  potentialRevenue: number;
  recoveredRevenue: number;
  lostRevenue: number;
}

export interface SensitivityAnalysisInput {
  variable: 'growthRate' | 'conversionRate' | 'averageOrderValue';
  minPercent: number; // e.g., -20
  maxPercent: number; // e.g., +20
  steps: number; // e.g., 5
}

export interface SensitivityAnalysisResult {
  variable: string;
  scenarios: {
    value: number;
    roi3Year: number;
    paybackPeriod: number;
    npv: number;
  }[];
}
