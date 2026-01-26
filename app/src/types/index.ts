
export interface BusinessProfile {
  companyName: string;
  businessModel: 'B2C' | 'B2B' | 'Both' | 'Retail' | 'Hybrid';
  industry: string;
  revenueBreakdown: {
    onlineB2C: number;
    onlineB2B: number;
    retail: number;
    wholesale: number;
  };
  annualGrowth: number;
  employees: {
    total: number;
    ecommerce: number;
    customerService: number;
    it: number;
  };
}

export interface CurrentStateMetrics {
  monthlyVisitors: number;
  conversionRate: number;
  mobileConversionRate: number;
  desktopConversionRate: number;
  cartAbandonmentRate: number;
  aov: number;
  annualOrderVolume: number;
  ordersPerMonth: number;
  peakMonthOrders: number;
  repeatPurchaseRate: number;
  cltv: number;
  cac: number;
  purchasesPerCustomer: number; // Added
}

export interface B2BMetrics {
  wholesaleCustomers: number;
  averageOrderValue: number;
  orderFrequency: 'Weekly' | 'Monthly' | 'Quarterly' | 'Annually';
  manualProcessingHours: number;
  painPoints: string[];
  desiredCapabilities: string[];
}

export interface RetailMetrics {
  locationCount: number;
  plannedLocations: number;
  posSystem: string;
  annualPosCost: number;
  revenueBreakdown: {
    inStore: number;
    bopis: number;
    shipFromStore: number;
  };
  painPoints: string[];
  desiredCapabilities: string[];
}

export interface MarketingMetrics {
  annualBudget: number;
  paidAdsSpend: number;
  emailSpend: number;
  smsSpend: number;
  tools: {
    email: string;
    sms: string;
    crm: string;
  };
  limitations: string[];
}

export interface OperationalCosts {
  manualOrderEntry: number; // hours/week
  customerQuoteRequests: number; // hours/week
  customPricing: number; // hours/week
  inventorySync: number; // hours/week
  reconciliation: number; // hours/week
  platformWorkarounds: number; // hours/week
  manualCSOrders: number; // hours/week (as percentage or count?) - prompt says %, context has hours. Let's stick to hours for cost calc simplicity or convert.
  // Prompt says: "Orders requiring manual intervention: ____%" and "Average time per manual order: ____ minutes"
  // But context currently uses hours. I will add the specific fields for calculation.
  manualInterventionPercent: number;
  manualInterventionTimePerOrder: number;
  hourlyRate: number;
}

export interface PlatformCosts {
  license: number;
  hosting: number;
  maintenance: number;
  integrations: number;
  downtimeLoss: number;
}

export interface BusinessInputs {
  profile: BusinessProfile;
  current: {
    platformCosts: PlatformCosts;
    metrics: CurrentStateMetrics;
    marketing: MarketingMetrics; // Added
    b2b: B2BMetrics; // Added
    retail: RetailMetrics; // Added
    painPoints: string[];
    operationalCosts: OperationalCosts;
    integrations: {
        accounting: string;
        fulfillment: string;
        marketing: string;
        painPoints: string[];
    }
  };
  migration: {
    implementationCost: number;
    shopifyPlan: number;
    apps: number;
    training: number;
    isTrainingIncluded: boolean;
    launchTimeline: string;
  };
  strategic: {
    growthGoals: string[];
    channelExpansion: string[]; // Added
    newCapabilities: string[];
    timelineConstraints: string; // Added
  };
  // Deprecated/Mapped fields kept for calculation compatibility until full refactor
  business: {
    annualRevenue: number;
    annualGrowth: number;
    grossMargin: number;
  };
}


export interface Scenario {
  name: 'conservative' | 'moderate' | 'aggressive';
  paybackPeriod: string;
  roi3Year: string;
  year1Revenue: string;
  year1RevenuePercent: string;
  tcoSavings: string;
  npv: string;
  revenueProjection: {
    year0: number;
    year1: number;
    year2: number;
    year3: number;
  };
  grossProfitImpact: {
    year1: number;
    year2: number;
    year3: number;
    total: number;
  };
  netBenefit: string;
  roiPercent: string;
  cashFlow: CashFlow[];
  investmentBreakdown: {
    implementation: number;
    platformFees: number;
    total: number;
  };
  includesRevenueGrowth?: boolean;
  costSavingsOnly?: number;
  revenueGrowthBenefit?: number;
  scenarioDescription?: string;
}

export interface CostBreakdown {
  category: string;
  year1: number;
  year2: number;
  year3: number;
  total: number;
}

export interface CashFlow {
  month: number;
  investment: number;
  platformCosts: number;
  returns: number;
  netCashFlow: number;
  cumulative: number;
}

export interface Risk {
  id: string;
  title: string;
  category: string;
  probability: 'Low' | 'Medium' | 'High';
  impact: 'Low' | 'Medium' | 'High';
  mitigation: string;
}

export interface ImplementationPhase {
  id: string;
  phase: number;
  title: string;
  duration: string;
  deliverables: string[];
  status: 'pending' | 'in-progress' | 'completed';
}
