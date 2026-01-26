import React, { createContext, useContext, useState, useMemo } from 'react';
import type { Scenario, BusinessInputs } from '../types';
import { formatCurrency } from '../utils/formatters';

interface ScenarioContextType {
  inputs: BusinessInputs;
  updateInput: (section: keyof BusinessInputs, field: string, value: any) => void;
  currentScenario: Scenario;
  selectedScenario: 'conservative' | 'moderate' | 'aggressive';
  setScenario: (name: string) => void;
  includeRevenueGrowth: boolean;
  setIncludeRevenueGrowth: (include: boolean) => void;
  totalRevenue: number;
}

const defaultInputs: BusinessInputs = {
  profile: {
    companyName: '',
    businessModel: 'B2C',
    industry: 'Fashion',
    revenueBreakdown: {
      onlineB2C: 0,
      onlineB2B: 0,
      retail: 0,
      wholesale: 0
    },
    annualGrowth: 0.05,
    employees: {
      total: 0,
      ecommerce: 0,
      customerService: 0,
      it: 0
    }
  },
  current: {
    platformCosts: {
      license: 0,
      hosting: 0,
      maintenance: 0,
      integrations: 0,
      downtimeLoss: 0
    },
    metrics: {
      monthlyVisitors: 0,
      conversionRate: 0,
      mobileConversionRate: 0,
      desktopConversionRate: 0,
      cartAbandonmentRate: 0,
      aov: 0,
      annualOrderVolume: 0,
      ordersPerMonth: 0,
      peakMonthOrders: 0,
      repeatPurchaseRate: 0,
      cltv: 0,
      cac: 0,
      purchasesPerCustomer: 0
    },
    marketing: {
      annualBudget: 0,
      paidAdsSpend: 0,
      emailSpend: 0,
      smsSpend: 0,
      tools: {
        email: '',
        sms: '',
        crm: ''
      },
      limitations: []
    },
    b2b: {
      wholesaleCustomers: 0,
      averageOrderValue: 0,
      orderFrequency: 'Monthly',
      manualProcessingHours: 0,
      painPoints: [],
      desiredCapabilities: []
    },
    retail: {
      locationCount: 0,
      plannedLocations: 0,
      posSystem: '',
      annualPosCost: 0,
      revenueBreakdown: {
        inStore: 0,
        bopis: 0,
        shipFromStore: 0
      },
      painPoints: [],
      desiredCapabilities: []
    },
    painPoints: [],
    operationalCosts: {
      manualOrderEntry: 0,
      customerQuoteRequests: 0,
      customPricing: 0,
      inventorySync: 0,
      reconciliation: 0,
      platformWorkarounds: 0,
      manualCSOrders: 0,
      manualInterventionPercent: 0,
      manualInterventionTimePerOrder: 0,
      hourlyRate: 0
    },
    integrations: {
        accounting: '',
        fulfillment: '',
        marketing: '',
        painPoints: []
    }
  },
  migration: {
    implementationCost: 0,
    shopifyPlan: 0,
    apps: 0,
    training: 0,
    isTrainingIncluded: false,
    launchTimeline: '16 weeks'
  },
  strategic: {
    growthGoals: [],
    channelExpansion: [],
    newCapabilities: [],
    timelineConstraints: ''
  },
  business: {
    annualRevenue: 0,
    annualGrowth: 0.05,
    grossMargin: 0.40
  }
};

const ScenarioContext = createContext<ScenarioContextType | undefined>(undefined);

export const ScenarioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [inputs, setInputs] = useState<BusinessInputs>(defaultInputs);
  const [selectedScenario, setSelectedScenario] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');
  const includeRevenueGrowth = true; // Always include revenue growth attribution

  const updateInput = (section: keyof BusinessInputs, field: string, value: any) => {
    setInputs(prev => {
      // Handle deep updates
      const sectionValue = prev[section] as any;
      
      // If field contains dots, it's a nested update (e.g., 'platformCosts.license' or 'b2b.wholesaleCustomers')
      if (field.includes('.')) {
        const parts = field.split('.');
        
        // Helper to update deep nested objects
        const updateNested = (obj: any, pathParts: string[], val: any): any => {
           if (pathParts.length === 1) {
             return { ...obj, [pathParts[0]]: val };
           }
           const [head, ...tail] = pathParts;
           return {
             ...obj,
             [head]: updateNested(obj[head] || {}, tail, val)
           };
        };

        return {
          ...prev,
          [section]: updateNested(sectionValue, parts, value)
        };
      }
      
      return {
        ...prev,
        [section]: {
          ...sectionValue,
          [field]: value
        }
      };
    });
  };

  // Calculate total revenue - memoized separately so it can be accessed independently
  const totalRevenue = useMemo(() => {
    const totalRevenueFromBreakdown = Object.values(inputs.profile.revenueBreakdown).reduce((a, b) => a + (Number(b) || 0), 0);
    return totalRevenueFromBreakdown > 0 ? totalRevenueFromBreakdown : inputs.business.annualRevenue;
  }, [inputs.profile.revenueBreakdown, inputs.business.annualRevenue]);

  const calculatedScenario = useMemo(() => {
    const { current, migration, business, profile } = inputs;
    
    // Use the calculated total revenue
    const annualRevenue = totalRevenue;

    // **PLATFORM COSTS CALCULATION**
    const currentCosts = current.platformCosts;
    
    // Current Annual Platform Costs (what they're paying now)
    const currentAnnualTCO = 
      (currentCosts.license || 0) + 
      (currentCosts.hosting || 0) + 
      (currentCosts.maintenance || 0) + 
      (currentCosts.integrations || 0);
      
    // Future Annual Platform Costs (Shopify)
    const futureAnnualTCO = (migration.shopifyPlan || 0) + (migration.apps || 0);
    
    // One-time implementation cost
    const oneTimeCost = migration.implementationCost + (migration.isTrainingIncluded ? 0 : migration.training);
    
    // Annual Cost Savings = Current - Future
    const annualCostSavings = currentAnnualTCO - futureAnnualTCO;

    // Growth Rates based on Scenario (always applied)
    // These represent SMALL, REALISTIC revenue lifts from platform improvements
    const scenarioRates = {
      conservative: { 
        year1: 0.02, year2: 0.015, year3: 0.01, 
        label: "Conservative",
        description: "2% revenue lift from basic optimization"
      },
      moderate: { 
        year1: 0.05, year2: 0.04, year3: 0.03, 
        label: "Moderate",
        description: "5% revenue lift from platform improvements"
      },
      aggressive: { 
        year1: 0.08, year2: 0.07, year3: 0.06, 
        label: "Aggressive",
        description: "8% revenue lift from full optimization"
      }
    };
    
    const rates = scenarioRates[selectedScenario];
    const baselineGrowth = profile.annualGrowth;

    // Revenue Projections (always with platform attribution)
    const year0 = annualRevenue;
    
    let year1, year2, year3;
    let revenueGainYear1 = 0, revenueGainYear2 = 0, revenueGainYear3 = 0;
    let gpGainYear1 = 0, gpGainYear2 = 0, gpGainYear3 = 0;
    
    if (annualRevenue > 0) {
      // Calculate baseline first (organic growth)
      const baselineYear1 = year0 * (1 + baselineGrowth);
      const baselineYear2 = baselineYear1 * (1 + baselineGrowth);
      const baselineYear3 = baselineYear2 * (1 + baselineGrowth);
      
      // Calculate revenue lift from platform (as % of baseline)
      const liftYear1 = baselineYear1 * rates.year1;
      const liftYear2 = baselineYear2 * rates.year2;
      const liftYear3 = baselineYear3 * rates.year3;
      
      // Total revenue = baseline + lift
      year1 = baselineYear1 + liftYear1;
      year2 = baselineYear2 + liftYear2;
      year3 = baselineYear3 + liftYear3;
      
      // Revenue gains (just the lift portion)
      revenueGainYear1 = liftYear1;
      revenueGainYear2 = liftYear2;
      revenueGainYear3 = liftYear3;
      
      // Gross profit from the lift
      gpGainYear1 = revenueGainYear1 * business.grossMargin;
      gpGainYear2 = revenueGainYear2 * business.grossMargin;
      gpGainYear3 = revenueGainYear3 * business.grossMargin;
    } else {
      // No revenue data yet
      year1 = year0 * (1 + baselineGrowth);
      year2 = year1 * (1 + baselineGrowth);
      year3 = year2 * (1 + baselineGrowth);
    }

    // Total Annual Benefit
    const annualBenefitYear1 = annualCostSavings + gpGainYear1;
    const annualBenefitYear2 = annualCostSavings + gpGainYear2;
    const annualBenefitYear3 = annualCostSavings + gpGainYear3;
    
    // 3-Year Totals
    const totalInvestment = oneTimeCost + (futureAnnualTCO * 3);
    const totalCostSavings = annualCostSavings * 3;
    const totalGrossProfitGain = gpGainYear1 + gpGainYear2 + gpGainYear3;
    const totalBenefit = totalCostSavings + totalGrossProfitGain;
    const netBenefit = totalBenefit - totalInvestment;
    
    // ROI
    const roiVal = totalInvestment > 0 ? (netBenefit / totalInvestment) * 100 : 0;

    // Payback Period
    const launchWeeks = parseInt(migration.launchTimeline) || 16;
    const implementationMonths = Math.ceil(launchWeeks / 4);
    const monthlyFutureCost = futureAnnualTCO / 12;
    const monthlyImplementation = oneTimeCost / implementationMonths;
    
    let cumulativeCashFlow = 0;
    let paybackMonths = 0;
    
    for (let month = 1; month <= 36; month++) {
      const investment = month <= implementationMonths ? monthlyImplementation : 0;
      const savings = currentAnnualTCO / 12; // What we were paying
      const platformCost = monthlyFutureCost; // What we pay now
      const revenueGain = includeRevenueGrowth ? (month <= 12 ? gpGainYear1 / 12 : 0) : 0; // Simplified
      
      const netCashFlow = savings + revenueGain - investment - platformCost;
      cumulativeCashFlow += netCashFlow;
      
      if (cumulativeCashFlow >= 0 && paybackMonths === 0) {
        paybackMonths = month;
        break;
      }
    }
    
    if (paybackMonths === 0) paybackMonths = 36;

    // Cash Flow Calculation (Monthly for Year 1)
    const monthlyCurrentCost = currentAnnualTCO / 12;
    const monthlyRevenueGain = includeRevenueGrowth ? gpGainYear1 / 12 : 0;

    const cashFlow = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const isImplementation = month <= implementationMonths;

      // Outflows
      const investment = isImplementation ? monthlyImplementation : 0;
      const platformCosts = monthlyFutureCost;

      // Inflows
      const returns = monthlyCurrentCost + monthlyRevenueGain;

      // Net
      const netCashFlow = returns - (investment + platformCosts);
      
      return {
        month,
        investment,
        platformCosts,
        returns,
        netCashFlow,
        cumulative: 0 // Will calculate after
      };
    });

    // Calculate cumulative
    let runningTotal = 0;
    cashFlow.forEach(m => {
      runningTotal += m.netCashFlow;
      m.cumulative = runningTotal;
    });

    // NPV Calculation
    const discountRate = 0.10;
    
    const npv = -oneTimeCost + 
                (annualBenefitYear1 / Math.pow(1 + discountRate, 1)) +
                (annualBenefitYear2 / Math.pow(1 + discountRate, 2)) +
                (annualBenefitYear3 / Math.pow(1 + discountRate, 3));

    return {
      name: selectedScenario,
      paybackPeriod: `${Math.max(0, paybackMonths).toFixed(1)} months`,
      roi3Year: `${roiVal.toFixed(1)}%`,
      year1Revenue: formatCurrency(year1),
      year1RevenuePercent: `+${(rates.year1 * 100).toFixed(0)}%`,
      tcoSavings: formatCurrency(annualCostSavings),
      npv: formatCurrency(npv),
      revenueProjection: {
        year0: year0 / 1000000,
        year1: year1 / 1000000,
        year2: year2 / 1000000,
        year3: year3 / 1000000
      },
      grossProfitImpact: {
        year1: gpGainYear1,
        year2: gpGainYear2,
        year3: gpGainYear3,
        total: totalGrossProfitGain
      },
      netBenefit: formatCurrency(netBenefit),
      roiPercent: `${roiVal.toFixed(1)}%`,
      cashFlow,
      investmentBreakdown: {
        implementation: oneTimeCost,
        platformFees: futureAnnualTCO * 3,
        total: totalInvestment
      },
      // Additional metadata for display
      includesRevenueGrowth: true,
      costSavingsOnly: annualCostSavings * 3,
      revenueGrowthBenefit: totalGrossProfitGain,
      scenarioDescription: rates.description,
      scenarioLabel: rates.label,
      scenarioRate: rates.year1
    };
  }, [inputs, selectedScenario, totalRevenue]);

  const setScenario = (name: string) => {
    if (['conservative', 'moderate', 'aggressive'].includes(name)) {
      setSelectedScenario(name as 'conservative' | 'moderate' | 'aggressive');
    }
  };

  return (
    <ScenarioContext.Provider value={{ 
      inputs, 
      updateInput, 
      currentScenario: calculatedScenario, 
      selectedScenario, 
      setScenario,
      includeRevenueGrowth: true,
      setIncludeRevenueGrowth: () => {}, // No-op function for backwards compatibility
      totalRevenue
    }}>
      {children}
    </ScenarioContext.Provider>
  );
};

export const useScenario = () => {
  const context = useContext(ScenarioContext);
  if (context === undefined) {
    throw new Error('useScenario must be used within a ScenarioProvider');
  }
  return context;
};
