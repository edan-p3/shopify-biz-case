import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Seed benchmarks
  console.log('Seeding benchmarks...');
  await prisma.benchmark.createMany({
    data: [
      {
        industry: 'retail',
        revenueRange: '1M-5M',
        averageConversionRate: 0.024,
        averageAOV: 85,
        cartAbandonmentRate: 0.72,
        cartRecoveryRate: 0.12,
        repeatPurchaseRate: 0.28,
        averageGrowthRate: 0.22,
      },
      {
        industry: 'b2b_wholesale',
        revenueRange: '1M-5M',
        averageConversionRate: 0.032,
        averageAOV: 450,
        cartAbandonmentRate: 0.68,
        cartRecoveryRate: 0.15,
        repeatPurchaseRate: 0.45,
        averageGrowthRate: 0.25,
      },
      {
        industry: 'consumer_goods',
        revenueRange: '1M-5M',
        averageConversionRate: 0.021,
        averageAOV: 65,
        cartAbandonmentRate: 0.74,
        cartRecoveryRate: 0.10,
        repeatPurchaseRate: 0.22,
        averageGrowthRate: 0.20,
      },
      {
        industry: 'retail',
        revenueRange: '5M-20M',
        averageConversionRate: 0.028,
        averageAOV: 95,
        cartAbandonmentRate: 0.70,
        cartRecoveryRate: 0.14,
        repeatPurchaseRate: 0.32,
        averageGrowthRate: 0.25,
      },
      {
        industry: 'b2b_wholesale',
        revenueRange: '5M-20M',
        averageConversionRate: 0.036,
        averageAOV: 520,
        cartAbandonmentRate: 0.66,
        cartRecoveryRate: 0.18,
        repeatPurchaseRate: 0.50,
        averageGrowthRate: 0.28,
      },
    ],
    skipDuplicates: true,
  });

  // Seed templates
  console.log('Seeding templates...');
  await prisma.template.createMany({
    data: [
      {
        name: 'Retail E-commerce Migration',
        description: 'Standard template for retail businesses migrating to Shopify',
        industry: 'retail',
        useCase: 'platform_migration',
        defaultRevenue: 1500000,
        defaultGrossMargin: 0.35,
        defaultImplementationCost: 50000,
        configJson: {
          defaultScenarios: ['CONSERVATIVE', 'MODERATE', 'AGGRESSIVE'],
          defaultGrowthRates: {
            CONSERVATIVE: [0.20, 0.20, 0.20],
            MODERATE: [0.25, 0.25, 0.25],
            AGGRESSIVE: [0.35, 0.30, 0.25],
          },
        },
      },
      {
        name: 'B2B Wholesale Platform',
        description: 'Template for B2B wholesale businesses',
        industry: 'b2b_wholesale',
        useCase: 'b2b_transformation',
        defaultRevenue: 5000000,
        defaultGrossMargin: 0.40,
        defaultImplementationCost: 75000,
        configJson: {
          defaultScenarios: ['CONSERVATIVE', 'MODERATE', 'AGGRESSIVE'],
          defaultGrowthRates: {
            CONSERVATIVE: [0.18, 0.18, 0.18],
            MODERATE: [0.22, 0.22, 0.22],
            AGGRESSIVE: [0.30, 0.28, 0.25],
          },
        },
      },
      {
        name: 'DTC Brand Launch',
        description: 'Direct-to-consumer brand launching on Shopify',
        industry: 'consumer_goods',
        useCase: 'new_launch',
        defaultRevenue: 500000,
        defaultGrossMargin: 0.45,
        defaultImplementationCost: 35000,
        configJson: {
          defaultScenarios: ['CONSERVATIVE', 'MODERATE', 'AGGRESSIVE'],
          defaultGrowthRates: {
            CONSERVATIVE: [0.40, 0.35, 0.30],
            MODERATE: [0.50, 0.45, 0.40],
            AGGRESSIVE: [0.70, 0.60, 0.50],
          },
        },
      },
    ],
    skipDuplicates: true,
  });

  // Create a sample business case
  console.log('Creating sample business case...');
  const sampleCase = await prisma.businessCase.create({
    data: {
      companyName: 'Sample Retail Co.',
      currentRevenue: 1500000,
      currentPlatform: 'Magento',
      industry: 'retail',
      grossMargin: 0.30,
      discountRate: 0.10,
      implementationCost: 50000,
      currentPlatformCost: 30000,
      status: 'ACTIVE',
      operationalCosts: {
        create: {
          revenueLeakage: 45000,
          operationalInefficiency: 60000,
          integrationMaintenance: 24000,
          manualProcessing: 36000,
        },
      },
      scenarios: {
        create: [
          {
            type: 'CONSERVATIVE',
            year1GrowthRate: 0.20,
            year2GrowthRate: 0.20,
            year3GrowthRate: 0.20,
            paybackPeriod: 10.2,
            roi3Year: 112,
            npv: 245000,
            netBenefit: 68800,
            assumptions: {
              create: {
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
            },
          },
          {
            type: 'MODERATE',
            year1GrowthRate: 0.25,
            year2GrowthRate: 0.25,
            year3GrowthRate: 0.25,
            paybackPeriod: 8.5,
            roi3Year: 162,
            npv: 385000,
            netBenefit: 123500,
            assumptions: {
              create: {
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
            },
          },
          {
            type: 'AGGRESSIVE',
            year1GrowthRate: 0.35,
            year2GrowthRate: 0.30,
            year3GrowthRate: 0.25,
            paybackPeriod: 6.8,
            roi3Year: 235,
            npv: 582000,
            netBenefit: 198400,
            assumptions: {
              create: {
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
            },
          },
        ],
      },
      risks: {
        create: [
          {
            title: 'Implementation Delays',
            category: 'TECHNICAL',
            probability: 'MEDIUM',
            impact: 'MEDIUM',
            description:
              'Project timeline extends beyond 18 weeks, delaying go-live and expected benefits realization',
            mitigation:
              'Fixed-price contract with penalty clauses, weekly milestone tracking, dedicated project manager',
            status: 'IDENTIFIED',
          },
          {
            title: 'Revenue Disruption During Migration',
            category: 'FINANCIAL',
            probability: 'LOW',
            impact: 'HIGH',
            description:
              'Potential revenue loss during platform cutover and stabilization period',
            mitigation:
              'Phased migration approach, comprehensive testing, backup rollback plan',
            status: 'MITIGATED',
          },
          {
            title: 'Team Adoption Challenges',
            category: 'OPERATIONAL',
            probability: 'MEDIUM',
            impact: 'MEDIUM',
            description:
              'Internal team resistance or slow adoption of new platform and processes',
            mitigation:
              'Early training program, change management support, dedicated support period',
            status: 'IDENTIFIED',
          },
          {
            title: 'Integration Complexities',
            category: 'TECHNICAL',
            probability: 'HIGH',
            impact: 'MEDIUM',
            description:
              'Challenges integrating with existing ERP, CRM, and other critical systems',
            mitigation:
              'Pre-implementation integration audit, experienced integration partners, buffer time',
            status: 'IDENTIFIED',
          },
          {
            title: 'Competitive Response',
            category: 'STRATEGIC',
            probability: 'LOW',
            impact: 'MEDIUM',
            description:
              'Competitors may respond aggressively if improved platform provides significant advantage',
            mitigation:
              'Continuous innovation roadmap, focus on customer experience differentiation',
            status: 'ACCEPTED',
          },
        ],
      },
    },
  });

  console.log(`Sample business case created with ID: ${sampleCase.id}`);
  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
