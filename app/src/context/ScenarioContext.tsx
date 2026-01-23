import React, { createContext, useContext, useState, useMemo } from 'react';
import type { Scenario, BusinessInputs } from '../types';
import { formatCurrency } from '../utils/formatters';

interface ScenarioContextType {
  inputs: BusinessInputs;
  updateInput: (section: keyof BusinessInputs, field: string, value: any) => void;
  currentScenario: Scenario;
  selectedScenario: 'conservative' | 'moderate' | 'aggressive';
  setScenario: (name: string) => void;
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

  const calculatedScenario = useMemo(() => {
    const { current, migration, business, profile } = inputs;
    
    // Calculate Total Revenue from Profile if not set in Business
    // This fixes the issue where revenue projection is 0 if business.annualRevenue isn't manually set
    // We prioritize the sum of the breakdown if it's greater than 0
    const totalRevenueFromBreakdown = Object.values(profile.revenueBreakdown).reduce((a, b) => a + (Number(b) || 0), 0);
    const annualRevenue = totalRevenueFromBreakdown > 0 ? totalRevenueFromBreakdown : business.annualRevenue;

    // Map new structure to calculation variables
    const currentCosts = current.platformCosts;
    const opsCosts = current.operationalCosts;
    
    // Calculate Annual Operational Inefficiencies
    const weeklyOpsHours = 
      opsCosts.manualOrderEntry + 
      opsCosts.customerQuoteRequests + 
      opsCosts.customPricing +
      opsCosts.inventorySync + 
      opsCosts.reconciliation +
      opsCosts.platformWorkarounds + 
      opsCosts.manualCSOrders;
      
    // Include B2B manual processing if applicable
    const b2bOpsHours = current.b2b?.manualProcessingHours || 0;
    
    const annualOpsInefficiencyCost = (weeklyOpsHours + b2bOpsHours) * opsCosts.hourlyRate * 52;
    
    // Costs
    const currentAnnualTCO = 
      currentCosts.license + 
      currentCosts.hosting + 
      currentCosts.maintenance + 
      currentCosts.integrations + 
      currentCosts.downtimeLoss + 
      annualOpsInefficiencyCost; // Now including labor costs
      
    const futureAnnualTCO = migration.shopifyPlan + migration.apps; // Annual inputs are already annual
    
    // One-time cost logic: if training is included, don't add it separately
    const oneTimeCost = migration.implementationCost + (migration.isTrainingIncluded ? 0 : migration.training);
    
    const annualTCOSavings = currentAnnualTCO - futureAnnualTCO;

    // Growth Rates based on Scenario - Now additive to baseline for realism
    const baselineGrowth = profile.annualGrowth;
    
    const scenarioMultipliers = {
      conservative: { growth: baselineGrowth + 0.05, label: "+5%" }, // Baseline + 5%
      moderate: { growth: baselineGrowth + 0.10, label: "+10%" },    // Baseline + 10%
      aggressive: { growth: baselineGrowth + 0.15, label: "+15%" }   // Baseline + 15%
    };
    
    const targetGrowth = scenarioMultipliers[selectedScenario].growth;

    // Revenue Projections
    const year0 = annualRevenue;
    const year1 = year0 * (1 + targetGrowth);
    const year2 = year1 * (1 + targetGrowth * 0.9); // Slight deceleration in growth rate itself, but compounding
    const year3 = year2 * (1 + targetGrowth * 0.9);

    const baselineYear1 = year0 * (1 + baselineGrowth);
    const baselineYear2 = baselineYear1 * (1 + baselineGrowth);
    const baselineYear3 = baselineYear2 * (1 + baselineGrowth);

    const revenueGainYear1 = year1 - baselineYear1;
    const revenueGainYear2 = year2 - baselineYear2;
    const revenueGainYear3 = year3 - baselineYear3;
    // Gross Profit Impact
    const gpGainYear1 = revenueGainYear1 * business.grossMargin;
    const gpGainYear2 = revenueGainYear2 * business.grossMargin;
    const gpGainYear3 = revenueGainYear3 * business.grossMargin;
    const totalGPGain = gpGainYear1 + gpGainYear2 + gpGainYear3;

    // 3-Year Totals
    const totalInvestment = oneTimeCost + (futureAnnualTCO * 3);
    const totalSavings = annualTCOSavings * 3;
    const netBenefit = totalGPGain + totalSavings - totalInvestment;
    
    // ROI
    const roiVal = totalInvestment > 0 ? (netBenefit / totalInvestment) * 100 : 0;

    // Payback Period (Realistic calculation with ramp-up)
    // Assume returns start after implementation period and ramp to full by month 2 after launch
    const year1NetBenefit = annualTCOSavings + gpGainYear1 - futureAnnualTCO;
    const monthlyBenefitY1 = year1NetBenefit / 12;
    
    // Factor in implementation period where there are no returns
    const implementationPeriodMonths = implementationMonths;
    let cumulativeReturns = 0;
    let paybackMonths = 0;
    
    for (let month = 1; month <= 36; month++) {
      if (month <= implementationPeriodMonths) {
        // No returns during implementation
        continue;
      } else if (month === implementationPeriodMonths + 1) {
        // First month after launch: 50% of full monthly benefit (ramp-up)
        cumulativeReturns += monthlyBenefitY1 * 0.5;
      } else if (month === implementationPeriodMonths + 2) {
        // Second month: 75% of full monthly benefit
        cumulativeReturns += monthlyBenefitY1 * 0.75;
      } else {
        // Full monthly benefit thereafter
        cumulativeReturns += monthlyBenefitY1;
      }
      
      if (cumulativeReturns >= oneTimeCost) {
        paybackMonths = month;
        break;
      }
    }
    
    // If not paid back in 36 months, cap at 36
    if (paybackMonths === 0) paybackMonths = 36;

    // Cash Flow Calculation (Monthly for Year 1)
    // Parse launch timeline to get months
    const launchWeeks = parseInt(migration.launchTimeline) || 16;
    const implementationMonths = Math.ceil(launchWeeks / 4);

    const monthlyImplementation = oneTimeCost / implementationMonths; 
    const monthlyFutureCost = futureAnnualTCO / 12;
    const monthlyCurrentCost = currentAnnualTCO / 12;
    
    // Recalculate monthly revenue gain based on inputs if needed, or keep high level projection
    const monthlyRevenueGain = revenueGainYear1 / 12;
    const monthlyGPGain = monthlyRevenueGain * business.grossMargin;
    const monthlySavings = monthlyCurrentCost - monthlyFutureCost; // Savings kick in after go-live

    const cashFlow = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const isImplementation = month <= implementationMonths;
      const isLive = month > implementationMonths;

      // Outflows
      const investment = isImplementation ? monthlyImplementation : 0;
      const platformCosts = monthlyFutureCost; // Assuming we pay this from start or after go-live? Usually from start if signed.

      // Inflows
      const returns = isLive ? (monthlyGPGain + monthlySavings) : 0;

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

    // NPV Calculation (Proper multi-year discounting at 10%)
    const discountRate = 0.10;
    const year1NetCashFlow = gpGainYear1 + annualTCOSavings - futureAnnualTCO;
    const year2NetCashFlow = gpGainYear2 + annualTCOSavings - futureAnnualTCO;
    const year3NetCashFlow = gpGainYear3 + annualTCOSavings - futureAnnualTCO;
    
    const npv = -oneTimeCost + 
                (year1NetCashFlow / Math.pow(1 + discountRate, 1)) +
                (year2NetCashFlow / Math.pow(1 + discountRate, 2)) +
                (year3NetCashFlow / Math.pow(1 + discountRate, 3));

    return {
      name: selectedScenario,
      paybackPeriod: `${Math.max(0, paybackMonths).toFixed(1)} months`,
      roi3Year: `${roiVal.toFixed(0)}%`,
      year1Revenue: `+${formatCurrency(revenueGainYear1)}`,
      year1RevenuePercent: `+${((targetGrowth - baselineGrowth) * 100).toFixed(0)}%`, // Show uplift vs baseline
      tcoSavings: formatCurrency(annualTCOSavings),
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
        total: totalGPGain
      },
      netBenefit: formatCurrency(netBenefit),
      roiPercent: `${roiVal.toFixed(0)}%`,
      cashFlow,
      investmentBreakdown: {
        implementation: oneTimeCost,
        platformFees: futureAnnualTCO * 3,
        total: totalInvestment
      }
    };
  }, [inputs, selectedScenario]);

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
      setScenario 
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
