import Joi from 'joi';

// Business Case Validation Schemas

export const createBusinessCaseSchema = Joi.object({
  companyName: Joi.string().required().min(2).max(100),
  currentRevenue: Joi.number().required().positive().min(100000).max(1000000000),
  currentPlatform: Joi.string().required().min(2).max(50),
  industry: Joi.string().required().min(2).max(50),
  grossMargin: Joi.number().min(0).max(1).default(0.30),
  discountRate: Joi.number().min(0).max(1).default(0.10),
  implementationCost: Joi.number().positive().default(50000),
  currentPlatformCost: Joi.number().required().positive(),
  operationalCosts: Joi.object({
    revenueLeakage: Joi.number().required().min(0),
    operationalInefficiency: Joi.number().required().min(0),
    integrationMaintenance: Joi.number().required().min(0),
    manualProcessing: Joi.number().required().min(0),
  }).required(),
});

export const updateBusinessCaseSchema = Joi.object({
  companyName: Joi.string().min(2).max(100),
  currentRevenue: Joi.number().positive().min(100000).max(1000000000),
  currentPlatform: Joi.string().min(2).max(50),
  industry: Joi.string().min(2).max(50),
  grossMargin: Joi.number().min(0).max(1),
  discountRate: Joi.number().min(0).max(1),
  implementationCost: Joi.number().positive(),
  currentPlatformCost: Joi.number().positive(),
  status: Joi.string().valid('DRAFT', 'ACTIVE', 'ARCHIVED'),
  tags: Joi.array().items(Joi.string()),
});

// Scenario Validation Schemas

export const updateScenarioSchema = Joi.object({
  year1GrowthRate: Joi.number().min(-0.5).max(5.0),
  year2GrowthRate: Joi.number().min(-0.5).max(5.0),
  year3GrowthRate: Joi.number().min(-0.5).max(5.0),
  assumptions: Joi.object({
    desktopConversionRate: Joi.number().min(0).max(1),
    mobileConversionRate: Joi.number().min(0).max(1),
    cartAbandonmentRate: Joi.number().min(0).max(1),
    cartRecoveryRate: Joi.number().min(0).max(1),
    averageOrderValue: Joi.number().positive(),
    aovGrowthRate: Joi.number().min(-0.5).max(5.0),
    repeatPurchaseRate: Joi.number().min(0).max(1),
    customerLifetimeOrders: Joi.number().positive(),
    b2bDigitalPenetration: Joi.number().min(0).max(1),
    b2bOrderFrequencyIncrease: Joi.number().min(-0.5).max(5.0),
  }),
});

export const createCustomScenarioSchema = Joi.object({
  year1GrowthRate: Joi.number().required().min(-0.5).max(5.0),
  year2GrowthRate: Joi.number().required().min(-0.5).max(5.0),
  year3GrowthRate: Joi.number().required().min(-0.5).max(5.0),
  assumptions: Joi.object({
    desktopConversionRate: Joi.number().required().min(0).max(1),
    mobileConversionRate: Joi.number().required().min(0).max(1),
    cartAbandonmentRate: Joi.number().required().min(0).max(1),
    cartRecoveryRate: Joi.number().required().min(0).max(1),
    averageOrderValue: Joi.number().required().positive(),
    aovGrowthRate: Joi.number().required().min(-0.5).max(5.0),
    repeatPurchaseRate: Joi.number().required().min(0).max(1),
    customerLifetimeOrders: Joi.number().required().positive(),
    b2bDigitalPenetration: Joi.number().required().min(0).max(1),
    b2bOrderFrequencyIncrease: Joi.number().required().min(-0.5).max(5.0),
  }).required(),
});

// Risk Validation Schemas

export const createRiskSchema = Joi.object({
  title: Joi.string().required().min(5).max(200),
  category: Joi.string()
    .required()
    .valid('TECHNICAL', 'FINANCIAL', 'OPERATIONAL', 'STRATEGIC'),
  probability: Joi.string().required().valid('LOW', 'MEDIUM', 'HIGH'),
  impact: Joi.string().required().valid('LOW', 'MEDIUM', 'HIGH'),
  description: Joi.string().required().min(10),
  mitigation: Joi.string().required().min(10),
  owner: Joi.string().optional(),
});

export const updateRiskSchema = Joi.object({
  title: Joi.string().min(5).max(200),
  category: Joi.string().valid('TECHNICAL', 'FINANCIAL', 'OPERATIONAL', 'STRATEGIC'),
  probability: Joi.string().valid('LOW', 'MEDIUM', 'HIGH'),
  impact: Joi.string().valid('LOW', 'MEDIUM', 'HIGH'),
  description: Joi.string().min(10),
  mitigation: Joi.string().min(10),
  owner: Joi.string(),
  status: Joi.string().valid('IDENTIFIED', 'MITIGATED', 'ACCEPTED', 'RESOLVED'),
});

// Export Validation Schemas

export const exportRequestSchema = Joi.object({
  type: Joi.string().required().valid('PDF', 'EXCEL', 'JSON'),
  scenario: Joi.string().valid('CONSERVATIVE', 'MODERATE', 'AGGRESSIVE'),
});

export const shareRequestSchema = Joi.object({
  expiresIn: Joi.number().required().positive().max(2592000), // Max 30 days
  scenario: Joi.string().valid('CONSERVATIVE', 'MODERATE', 'AGGRESSIVE'),
});

// Sensitivity Analysis Validation Schema

export const sensitivityAnalysisSchema = Joi.object({
  variable: Joi.string()
    .required()
    .valid('growthRate', 'conversionRate', 'averageOrderValue'),
  minPercent: Joi.number().required().min(-100).max(0),
  maxPercent: Joi.number().required().min(0).max(500),
  steps: Joi.number().required().integer().min(3).max(20),
});

// Auth Validation Schemas

export const loginSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required().min(6),
});

export const registerSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required().min(8).max(100),
  firstName: Joi.string().required().min(2).max(50),
  lastName: Joi.string().required().min(2).max(50),
  company: Joi.string().max(100),
});

// Query Validation Schemas

export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  sortBy: Joi.string(),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

export const businessCaseListQuerySchema = paginationSchema.keys({
  status: Joi.string().valid('DRAFT', 'ACTIVE', 'ARCHIVED'),
  companyName: Joi.string(),
  industry: Joi.string(),
});

// Helper function to validate request body
export function validateBody(schema: Joi.ObjectSchema) {
  return (req: any, res: any, next: any) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: errors,
        },
      });
    }

    req.body = value;
    next();
  };
}

// Helper function to validate query parameters
export function validateQuery(schema: Joi.ObjectSchema) {
  return (req: any, res: any, next: any) => {
    const { error, value } = schema.validate(req.query, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: errors,
        },
      });
    }

    req.query = value;
    next();
  };
}
