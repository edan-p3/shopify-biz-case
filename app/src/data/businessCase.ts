export const BUSINESS_CASE_DATA = {
  summary: {
    roi3Year: 9.27, // 9.27% - REALISTIC cost savings ROI
    paybackPeriodMonths: 11, // 11 months - REALISTIC payback
    paybackPeriodLabel: "Payback Period",
    breakevenMonth: 11, // Month 11 - breakeven point
    npv3Year: -71116, // -$71,116 - Slightly negative NPV at 10% discount (realistic for cost-savings only)
    initialInvestment: 230000, // Implementation
    total3YearInvestment: 755000, // $755k (Implementation + 3 years platform costs)
  },
  scenarios: {
    conservative: {
      label: "Conservative",
      revenueUpliftYear1: 0, // Not attributing revenue growth to platform
      roi: 7.5, // Conservative scenario: lower savings
      npv: -100000, // Negative NPV in conservative case
    },
    moderate: {
      label: "Moderate",
      revenueUpliftYear1: 0, // Not attributing revenue growth to platform
      roi: 9.27, // Based on actual cost savings
      npv: -71116, // Realistic NPV
    },
    aggressive: {
      label: "Aggressive",
      revenueUpliftYear1: 0, // Not attributing revenue growth to platform  
      roi: 12.0, // Aggressive: assumes additional efficiency gains
      npv: -40000, // Better NPV with additional savings
    }
  },
  revenueProjection: {
    baseline: {
      year0: 200000000, // Current revenue
      year1: 210000000, // 5% organic growth
      year2: 220500000,
      year3: 231525000,
    },
    shopify: {
      year0: 200000000,
      year1: 210000000, // Same growth (not attributing revenue to platform migration)
      year2: 220500000,
      year3: 231525000,
    }
  },
  grossProfitImpact: {
    year1: 275000, // Annual cost savings
    year2: 275000,
    year3: 275000,
    total: 825000  // 3-year total savings
  },
  investment: {
    implementation: 230000,
    platformFeesAnnual: 175000, // $150K Shopify + $25K Apps
    total3Year: 755000, // $230K + ($175K * 3)
    schedule: [
      { category: "Implementation (One-time)", year1: 230000, year2: 0, year3: 0, total: 230000 },
      { category: "Platform & Apps", year1: 175000, year2: 175000, year3: 175000, total: 525000 },
    ],
    operationalSavings: {
      legacyCost: 450000, // Current platform costs
      projectedCost: 175000, // Shopify costs
      annualEfficiencyGain: 275000 // Annual savings
    },
    costStructureShift: {
      capex: 30, // Implementation is ~30% of 3-year total
      opex: 70  // Platform fees are ~70% of 3-year total
    }
  },
  currentLimitations: [
    { name: "Platform License", impact: -300000 },
    { name: "Hosting/Infrastructure", impact: -50000 },
    { name: "Maintenance & Support", impact: -50000 },
    { name: "3rd Party Integrations", impact: -50000 },
    { name: "Total Annual Loss", impact: -450000, isTotal: true }
  ],
  cashFlow: {
    maxInvestment: 138333, // Peak negative cash flow at month 4
    breakevenMonth: 11,
    year1EndingPosition: 45000, // Realistic year 1 position
    monthlyData: [
      { month: 1, net: -34583, cumulative: -34583 },
      { month: 2, net: -34583, cumulative: -69167 },
      { month: 3, net: -34583, cumulative: -103750 },
      { month: 4, net: -34583, cumulative: -138333 }, // Peak investment
      { month: 5, net: 22917, cumulative: -115417 }, // Implementation complete, savings begin
      { month: 6, net: 22917, cumulative: -92500 },
      { month: 7, net: 22917, cumulative: -69583 },
      { month: 8, net: 22917, cumulative: -46667 },
      { month: 9, net: 22917, cumulative: -23750 },
      { month: 10, net: 22917, cumulative: -833 },
      { month: 11, net: 22917, cumulative: 22083 }, // Breakeven!
      { month: 12, net: 22917, cumulative: 45000 }, // Year 1 ending position
    ]
  }
};

// Risk Assessment Data
export const risks = [
  {
    id: '1',
    title: 'Implementation Delays',
    category: 'Technical',
    probability: 'Medium',
    impact: 'Medium',
    description: 'Project timeline extends beyond 18 weeks, delaying go-live and expected benefits realization.',
    mitigation: 'Fixed-price contract with penalty clauses, weekly milestone tracking, dedicated project manager.'
  },
  {
    id: '2',
    title: 'Revenue Disruption During Migration',
    category: 'Financial',
    probability: 'Low',
    impact: 'High',
    description: 'Potential revenue loss during platform cutover and stabilization period.',
    mitigation: 'Phased migration approach, comprehensive testing, backup rollback plan.'
  },
  {
    id: '3',
    title: 'Team Adoption Challenges',
    category: 'Operational',
    probability: 'Medium',
    impact: 'Medium',
    description: 'Internal team resistance or slow adoption of new platform and processes.',
    mitigation: 'Early training program, change management support, dedicated support period.'
  },
  {
    id: '4',
    title: 'Integration Complexities',
    category: 'Technical',
    probability: 'High',
    impact: 'Medium',
    description: 'Challenges integrating with existing ERP, CRM, and other critical systems.',
    mitigation: 'Pre-implementation integration audit, experienced integration partners, buffer time.'
  }
];
