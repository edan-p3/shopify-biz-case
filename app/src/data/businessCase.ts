export const BUSINESS_CASE_DATA = {
  summary: {
    roi3Year: 4815, // 4,815%
    paybackPeriodMonths: 0.5, // "0.5 months" velocity metric
    paybackPeriodLabel: "Post-Launch Payback",
    breakevenMonth: 5, // "Month 5" calendar metric
    npv3Year: 24597295, // $24,597,295
    initialInvestment: 230000, // Implementation
    total3YearInvestment: 680000, // $680k
  },
  scenarios: {
    conservative: {
      label: "Conservative",
      revenueUpliftYear1: 10000000, // Assumption for conservative
      roi: 2400,
      npv: 12000000,
    },
    moderate: {
      label: "Moderate",
      revenueUpliftYear1: 20000000, // +$20M (Confirmed)
      roi: 4815, // Confirmed
      npv: 24597295, // Confirmed
    },
    aggressive: {
      label: "Aggressive",
      revenueUpliftYear1: 30000000, // Assumption
      roi: 7200,
      npv: 36000000,
    }
  },
  revenueProjection: {
    baseline: {
      year0: 200000000, // Inferring baseline from +10% = $20M uplift. $20M is 10% of $200M.
      year1: 210000000, // 5% organic growth
      year2: 220500000,
      year3: 231525000,
    },
    shopify: {
      year0: 200000000,
      year1: 230000000, // Baseline + $20M uplift
      year2: 252000000, // Acceleration
      year3: 280000000,
    }
  },
  grossProfitImpact: {
    year1: 5000000,
    year2: 10300000,
    year3: 16994000,
    total: 32294000
  },
  investment: {
    implementation: 230000,
    platformFeesAnnual: 150000,
    total3Year: 680000,
    schedule: [
      { category: "Implementation (One-time)", year1: 230000, year2: 0, year3: 0, total: 230000 },
      { category: "Platform & Apps", year1: 150000, year2: 150000, year3: 150000, total: 450000 },
    ],
    operationalSavings: {
      legacyCost: 525000,
      projectedCost: 150000,
      annualEfficiencyGain: 375000
    },
    costStructureShift: {
      capex: 34,
      opex: 66
    }
  },
  currentLimitations: [
    { name: "Platform License", impact: -300000 },
    { name: "Maintenance & Support", impact: -150000 },
    { name: "3rd Party Integrations", impact: -75000 },
    { name: "Total Annual Loss", impact: -525000, isTotal: true }
  ],
  cashFlow: {
    maxInvestment: 280000,
    breakevenMonth: 5,
    year1EndingPosition: 3203333,
    monthlyData: [
      { month: 1, net: -50000, cumulative: -50000 },
      { month: 2, net: -80000, cumulative: -130000 },
      { month: 3, net: -80000, cumulative: -210000 },
      { month: 4, net: -70000, cumulative: -280000 }, // Peak investment ~280k
      { month: 5, net: 300000, cumulative: 20000 }, // Breakeven flip
      { month: 6, net: 416000, cumulative: 436000 },
      { month: 7, net: 416000, cumulative: 852000 },
      { month: 8, net: 416000, cumulative: 1268000 },
      { month: 9, net: 416000, cumulative: 1684000 },
      { month: 10, net: 416000, cumulative: 2100000 },
      { month: 11, net: 416000, cumulative: 2516000 },
      { month: 12, net: 416000, cumulative: 3203333 }, // Matches Year 1 Ending Position
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
