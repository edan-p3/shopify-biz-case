# Claude Backend Development Prompt
## Shopify Business Case API & Data Layer

### Project Context

The frontend React application has been completed according to the Gemini Frontend Prompt. It displays an interactive Shopify Commerce Platform Migration business case with scenario comparisons, financial projections, charts, and comprehensive business analysis.

**Your task:** Build a robust, scalable backend system that powers this frontend with data management, APIs, calculations, and business logic.

---

## Technical Requirements

### Backend Stack

**Core Technologies:**
- **Node.js 18+** with TypeScript
- **Express.js** or **Fastify** for API framework
- **PostgreSQL** for primary database (relational data)
- **Redis** for caching and session management
- **Prisma** or **TypeORM** for database ORM
- **JWT** for authentication (if user management required)

**Optional but Recommended:**
- **GraphQL** (Apollo Server) as alternative/complement to REST
- **Bull** or **BullMQ** for job queues (PDF generation, email)
- **Winston** or **Pino** for logging
- **Joi** or **Zod** for validation
- **Jest** for testing
- **Docker** for containerization
- **AWS S3** or **Cloudinary** for file storage

---

## Core Backend Components

### 1. Data Models & Database Schema

Create comprehensive data models for:

#### Business Case Model
```typescript
interface BusinessCase {
  id: string;
  companyName: string;
  currentRevenue: number;
  currentPlatform: string;
  industry: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string; // User ID if auth implemented
  
  // Financial assumptions
  grossMargin: number; // default 0.30
  discountRate: number; // default 0.10
  implementationCost: number; // default 50000
  
  // Current state costs
  currentPlatformCost: number;
  currentOperationalCosts: OperationalCosts;
  
  // Scenarios
  scenarios: Scenario[];
  
  // Implementation details
  implementationTimeline: ImplementationPhase[];
  
  // Metadata
  status: 'draft' | 'active' | 'archived';
  tags?: string[];
}

interface OperationalCosts {
  revenueLeakage: number;
  operationalInefficiency: number;
  integrationMaintenance: number;
  manualProcessing: number;
}

interface Scenario {
  id: string;
  businessCaseId: string;
  type: 'conservative' | 'moderate' | 'aggressive';
  
  // Growth rates
  year1GrowthRate: number;
  year2GrowthRate: number;
  year3GrowthRate: number;
  
  // Revenue projections
  revenueProjections: YearlyProjection[];
  
  // Cost projections
  costProjections: YearlyProjection[];
  
  // Calculated metrics (computed on-the-fly or cached)
  paybackPeriod: number; // in months
  roi3Year: number; // percentage
  npv: number;
  netBenefit: number;
  
  // Cash flow
  cashFlowMonthly: MonthlyCashFlow[];
  
  // Assumptions
  assumptions: ScenarioAssumptions;
}

interface YearlyProjection {
  year: number; // 0, 1, 2, 3
  revenue: number;
  costs: number;
  grossProfit: number;
  netCashFlow: number;
}

interface MonthlyCashFlow {
  month: number; // 1-12
  investment: number;
  platformCosts: number;
  returns: number; // gross profit returns
  netCashFlow: number;
  cumulative: number;
}

interface ScenarioAssumptions {
  // Conversion rates
  desktopConversionRate: number;
  mobileConversionRate: number;
  cartAbandonmentRate: number;
  cartRecoveryRate: number;
  
  // Order metrics
  averageOrderValue: number;
  aovGrowthRate: number;
  
  // Customer metrics
  repeatPurchaseRate: number;
  customerLifetimeOrders: number;
  
  // B2B metrics
  b2bDigitalPenetration: number;
  b2bOrderFrequencyIncrease: number;
}

interface ImplementationPhase {
  id: string;
  phaseNumber: number;
  name: string;
  duration: number; // weeks
  startWeek: number;
  endWeek: number;
  description: string;
  deliverables: string[];
  milestones: Milestone[];
  cost: number;
}

interface Milestone {
  name: string;
  dueDate: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
}
```

#### Risk Assessment Model
```typescript
interface Risk {
  id: string;
  businessCaseId: string;
  title: string;
  category: 'technical' | 'financial' | 'operational' | 'strategic';
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  description: string;
  mitigation: string;
  owner?: string;
  status: 'identified' | 'mitigated' | 'accepted' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}
```

#### User Model (if authentication required)
```typescript
interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  company: string;
  role: 'admin' | 'viewer' | 'editor';
  createdAt: Date;
  lastLogin: Date;
}
```

#### Export/Report Model
```typescript
interface Export {
  id: string;
  businessCaseId: string;
  userId?: string;
  type: 'pdf' | 'excel' | 'json';
  scenario?: 'conservative' | 'moderate' | 'aggressive';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  fileUrl?: string;
  createdAt: Date;
  expiresAt: Date; // for temporary download links
}
```

---

### 2. API Endpoints

Design RESTful APIs (or GraphQL) for all functionality:

#### Business Case Endpoints

**GET /api/business-cases**
- List all business cases (with pagination, filtering, sorting)
- Query params: `page`, `limit`, `status`, `companyName`, `sortBy`
- Response: Paginated list of business cases

**GET /api/business-cases/:id**
- Get complete business case with all scenarios and calculations
- Include computed metrics (ROI, payback, NPV)
- Response: Full business case object

**POST /api/business-cases**
- Create new business case
- Body: Company details, current state, financial assumptions
- Auto-generate three default scenarios (conservative/moderate/aggressive)
- Response: Created business case with ID

**PUT /api/business-cases/:id**
- Update business case details
- Body: Updated fields
- Recalculate dependent metrics
- Response: Updated business case

**DELETE /api/business-cases/:id**
- Soft delete business case (set status to 'archived')
- Response: Success message

---

#### Scenario Endpoints

**GET /api/business-cases/:id/scenarios**
- Get all scenarios for a business case
- Response: Array of scenarios with full calculations

**GET /api/business-cases/:id/scenarios/:scenarioType**
- Get specific scenario (conservative/moderate/aggressive)
- Response: Detailed scenario object

**PUT /api/business-cases/:id/scenarios/:scenarioType**
- Update scenario assumptions
- Body: Updated growth rates, conversion rates, etc.
- Trigger recalculation of all financial metrics
- Response: Updated scenario with new calculations

**POST /api/business-cases/:id/scenarios/custom**
- Create custom scenario with user-defined parameters
- Body: Custom growth rates and assumptions
- Response: New custom scenario with calculations

---

#### Financial Calculations Endpoints

**GET /api/business-cases/:id/scenarios/:scenarioType/revenue-projections**
- Get 3-year revenue projections
- Response: Year-by-year breakdown

**GET /api/business-cases/:id/scenarios/:scenarioType/cash-flow**
- Get monthly cash flow for Year 1 and summary for Years 2-3
- Response: Month-by-month cash flow analysis

**GET /api/business-cases/:id/scenarios/:scenarioType/tco**
- Get Total Cost of Ownership breakdown
- Response: Current state vs Shopify state comparison

**GET /api/business-cases/:id/scenarios/:scenarioType/roi**
- Get ROI metrics (payback period, NPV, IRR, 3-year ROI)
- Response: Comprehensive ROI analysis

**POST /api/business-cases/:id/scenarios/:scenarioType/sensitivity-analysis**
- Run sensitivity analysis on key variables
- Body: Variable ranges to test (e.g., growth rate ±20%)
- Response: Impact on ROI/payback across variable ranges

---

#### Risk Management Endpoints

**GET /api/business-cases/:id/risks**
- Get all risks for business case
- Response: Array of risk objects

**POST /api/business-cases/:id/risks**
- Add new risk
- Body: Risk details
- Response: Created risk object

**PUT /api/business-cases/:id/risks/:riskId**
- Update risk details or status
- Body: Updated fields
- Response: Updated risk object

**DELETE /api/business-cases/:id/risks/:riskId**
- Delete risk
- Response: Success message

**GET /api/business-cases/:id/risk-matrix**
- Get risk matrix visualization data
- Response: Risks grouped by probability/impact

---

#### Export & Reporting Endpoints

**POST /api/business-cases/:id/export**
- Generate PDF, Excel, or JSON export
- Body: `{ type: 'pdf' | 'excel' | 'json', scenario?: 'conservative' | 'moderate' | 'aggressive' }`
- Async job: Queue export generation
- Response: Job ID and status URL

**GET /api/exports/:jobId**
- Check export job status
- Response: Status and download URL when complete

**GET /api/exports/:jobId/download**
- Download generated export
- Response: File stream

**POST /api/business-cases/:id/share**
- Generate shareable link with expiration
- Body: `{ expiresIn: 86400, scenario?: string }`
- Response: Shareable URL and expiration time

---

#### Benchmark & Template Endpoints

**GET /api/benchmarks**
- Get industry benchmarks (conversion rates, growth rates, etc.)
- Query params: `industry`, `revenueRange`
- Response: Benchmark data

**GET /api/templates**
- Get business case templates
- Query params: `industry`, `useCase`
- Response: Pre-configured templates

**POST /api/business-cases/from-template/:templateId**
- Create business case from template
- Body: Company-specific details
- Response: New business case

---

#### Analytics & Insights Endpoints (Optional)

**GET /api/analytics/usage**
- Track business case views, scenario comparisons, exports
- Response: Usage statistics

**GET /api/analytics/conversions**
- Track which scenarios lead to "approvals" or actions
- Response: Conversion funnel data

---

### 3. Business Logic & Calculations

Implement robust calculation engine for all financial metrics:

#### Core Calculation Functions

**calculateRevenueProjection()**
```typescript
function calculateRevenueProjection(
  baseRevenue: number,
  growthRates: number[],
  years: number = 3
): YearlyProjection[] {
  // Calculate year-over-year revenue based on growth rates
  // Return array of projections for each year
}
```

**calculateROI()**
```typescript
function calculateROI(
  grossProfitReturns: number[],
  totalInvestment: number
): {
  roi3Year: number;
  paybackPeriod: number;
  npv: number;
  irr: number;
} {
  // Calculate return on investment metrics
  // Payback period in months
  // Net Present Value with discount rate
  // Internal Rate of Return
}
```

**calculateCashFlow()**
```typescript
function calculateCashFlow(
  implementationCosts: number[],
  platformCosts: number[],
  grossProfitReturns: number[],
  timelinMonths: number = 36
): MonthlyCashFlow[] {
  // Calculate month-by-month cash flow
  // Include implementation outflows, ongoing costs, returns
  // Track cumulative cash position
  // Identify breakeven month
}
```

**calculateTCO()**
```typescript
function calculateTCO(
  currentStateCosts: CurrentCosts,
  shopifyStateCosts: ShopifyCosts,
  years: number = 3
): TCOComparison {
  // Compare total cost of ownership
  // Current platform vs Shopify over 3 years
  // Include all cost categories
}
```

**calculateConversionImpact()**
```typescript
function calculateConversionImpact(
  currentConversion: number,
  newConversion: number,
  trafficVolume: number,
  averageOrderValue: number
): {
  additionalOrders: number;
  revenueImpact: number;
  improvementPercent: number;
} {
  // Calculate revenue impact of conversion rate improvements
}
```

**calculateAbandonedCartRecovery()**
```typescript
function calculateAbandonedCartRecovery(
  revenue: number,
  abandonmentRate: number,
  recoveryRate: number
): {
  potentialRevenue: number;
  recoveredRevenue: number;
  lostRevenue: number;
} {
  // Calculate abandoned cart recovery opportunity and impact
}
```

---

### 4. Data Seeding & Default Content

Create database seeders with:

#### Default Business Case Template
- Pre-populated with data from business case document
- P3 Media client averages as defaults
- Three standard scenarios configured

#### Industry Benchmarks
```typescript
const industryBenchmarks = {
  'retail': {
    averageConversionRate: 0.024,
    averageAOV: 85,
    cartAbandonmentRate: 0.72,
    // ... more benchmarks
  },
  'b2b_wholesale': {
    averageConversionRate: 0.032,
    averageAOV: 450,
    cartAbandonmentRate: 0.68,
  },
  'consumer_goods': {
    averageConversionRate: 0.021,
    averageAOV: 65,
    cartAbandonmentRate: 0.74,
  }
}
```

#### Standard Risk Library
- Pre-defined risks from business case document
- Implementation delay risks
- Revenue disruption risks
- Adoption challenges
- Integration issues
- With mitigation strategies

#### Implementation Roadmap Template
- 6-phase implementation plan
- Week-by-week timeline
- Deliverables and milestones
- From business case document

---

### 5. Caching Strategy

Implement Redis caching for:

**Calculated Metrics:**
- Cache ROI calculations (expensive compute)
- Cache key: `businessCase:${id}:scenario:${type}:metrics`
- TTL: 1 hour (invalidate on scenario update)

**Benchmark Data:**
- Cache industry benchmarks
- Cache key: `benchmarks:${industry}`
- TTL: 24 hours (static data)

**Business Case Views:**
- Cache full business case responses
- Cache key: `businessCase:${id}:full`
- TTL: 5 minutes (frequently updated)

**Export Jobs:**
- Cache export results
- Cache key: `export:${jobId}`
- TTL: 24 hours (then delete from S3)

---

### 6. Background Jobs & Queues

Use Bull/BullMQ for async processing:

#### PDF Generation Job
```typescript
queue.process('generate-pdf', async (job) => {
  const { businessCaseId, scenario } = job.data;
  
  // Fetch business case data
  // Generate PDF using Puppeteer or PDFKit
  // Upload to S3
  // Update export record with file URL
  // Send notification (email or webhook)
});
```

#### Excel Report Job
```typescript
queue.process('generate-excel', async (job) => {
  const { businessCaseId, scenario } = job.data;
  
  // Fetch business case data
  // Generate Excel using ExcelJS
  // Include multiple sheets (summary, projections, cash flow, TCO, risks)
  // Upload to S3
  // Update export record
});
```

#### Scheduled Metrics Recalculation
```typescript
cron.schedule('0 */6 * * *', async () => {
  // Recalculate metrics for all active business cases
  // Update benchmark data from external sources
  // Clear stale caches
});
```

---

### 7. Validation & Error Handling

Implement comprehensive validation:

#### Input Validation
```typescript
const businessCaseSchema = Joi.object({
  companyName: Joi.string().required().min(2).max(100),
  currentRevenue: Joi.number().required().positive().min(100000).max(1000000000),
  currentPlatform: Joi.string().required(),
  industry: Joi.string().required(),
  grossMargin: Joi.number().min(0).max(1).default(0.30),
  // ... more fields
});
```

#### Financial Constraints
- Validate growth rates are reasonable (-50% to +500%)
- Validate costs are positive numbers
- Validate dates are in logical sequence
- Validate percentages are between 0 and 1

#### Error Responses
```typescript
{
  success: false,
  error: {
    code: 'INVALID_GROWTH_RATE',
    message: 'Growth rate must be between -50% and 500%',
    field: 'year1GrowthRate',
    value: 10.5
  }
}
```

#### Error Codes
- `BUSINESS_CASE_NOT_FOUND`
- `INVALID_SCENARIO_TYPE`
- `CALCULATION_ERROR`
- `EXPORT_GENERATION_FAILED`
- `INSUFFICIENT_PERMISSIONS`
- `RATE_LIMIT_EXCEEDED`

---

### 8. Security & Authentication (Optional but Recommended)

If implementing user management:

#### JWT Authentication
```typescript
// Login endpoint
POST /api/auth/login
Body: { email, password }
Response: { token, user }

// Protected routes use JWT middleware
app.use('/api/business-cases', authenticateJWT);
```

#### Role-Based Access Control
```typescript
enum UserRole {
  ADMIN = 'admin',    // Full access
  EDITOR = 'editor',  // Can create and edit
  VIEWER = 'viewer'   // Read-only access
}

// Middleware
function authorize(roles: UserRole[]) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}
```

#### Rate Limiting
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

#### Input Sanitization
- Sanitize all user inputs to prevent XSS
- Use parameterized queries to prevent SQL injection
- Validate file uploads (type, size, content)

---

### 9. Testing Strategy

Implement comprehensive tests:

#### Unit Tests
```typescript
describe('Financial Calculations', () => {
  test('calculateROI returns correct payback period', () => {
    const result = calculateROI([90000, 108000, 129600], 117200);
    expect(result.paybackPeriod).toBeCloseTo(10.2, 1);
  });
  
  test('calculateRevenueProjection handles negative growth', () => {
    const projections = calculateRevenueProjection(1500000, [-0.1, -0.05, 0], 3);
    expect(projections[1].revenue).toBe(1350000);
  });
});
```

#### Integration Tests
```typescript
describe('Business Case API', () => {
  test('POST /api/business-cases creates case with scenarios', async () => {
    const response = await request(app)
      .post('/api/business-cases')
      .send({ companyName: 'Test Corp', currentRevenue: 1500000, ... });
    
    expect(response.status).toBe(201);
    expect(response.body.scenarios).toHaveLength(3);
  });
  
  test('GET /api/business-cases/:id returns calculated metrics', async () => {
    const response = await request(app).get(`/api/business-cases/${testId}`);
    
    expect(response.body.scenarios[1].paybackPeriod).toBeDefined();
    expect(response.body.scenarios[1].roi3Year).toBeGreaterThan(0);
  });
});
```

#### End-to-End Tests
- Test complete user flows (create case → update scenario → generate export)
- Test error handling and edge cases
- Test performance with large datasets

---

### 10. Performance Optimization

#### Database Optimization
- Index frequently queried fields (businessCaseId, userId, status, createdAt)
- Use database views for complex joins
- Implement connection pooling
- Use read replicas for reporting queries

#### Query Optimization
```typescript
// Eager load related data
const businessCase = await prisma.businessCase.findUnique({
  where: { id },
  include: {
    scenarios: {
      include: {
        revenueProjections: true,
        cashFlowMonthly: true
      }
    },
    risks: true,
    implementationTimeline: true
  }
});
```

#### Response Compression
```typescript
import compression from 'compression';
app.use(compression());
```

#### Pagination
```typescript
// Always paginate list endpoints
GET /api/business-cases?page=1&limit=20

// Response includes pagination metadata
{
  data: [...],
  pagination: {
    total: 145,
    page: 1,
    limit: 20,
    totalPages: 8
  }
}
```

---

### 11. Logging & Monitoring

#### Structured Logging
```typescript
import winston from 'winston';

const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Log important events
logger.info('Business case created', { businessCaseId, userId });
logger.error('Calculation failed', { error, businessCaseId, scenario });
```

#### Monitoring
- Track API response times
- Monitor error rates by endpoint
- Track calculation performance
- Monitor queue depth and processing times
- Alert on failures or performance degradation

#### Health Check Endpoint
```typescript
GET /api/health

Response:
{
  status: 'healthy',
  timestamp: '2026-01-19T10:30:00Z',
  services: {
    database: 'connected',
    redis: 'connected',
    queue: 'operational'
  },
  version: '1.0.0'
}
```

---

### 12. API Documentation

Use Swagger/OpenAPI for documentation:

```typescript
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Shopify Business Case API',
      version: '1.0.0',
      description: 'API for managing Shopify migration business cases'
    },
    servers: [
      { url: 'http://localhost:3001', description: 'Development' },
      { url: 'https://api.example.com', description: 'Production' }
    ]
  },
  apis: ['./src/routes/*.ts']
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
```

**Document all endpoints with:**
- Description and purpose
- Request parameters and body schema
- Response schema and examples
- Error codes and meanings
- Authentication requirements

---

## Implementation Priorities

### Phase 1: Core Foundation (Week 1-2)
1. Project setup (TypeScript, Express, Prisma, PostgreSQL, Redis)
2. Database schema design and migration
3. Core data models and relationships
4. Basic CRUD endpoints for business cases
5. Financial calculation functions
6. Unit tests for calculations

### Phase 2: Business Logic (Week 2-3)
1. Scenario management endpoints
2. Complete financial calculations (ROI, cash flow, TCO)
3. Risk management endpoints
4. Implementation roadmap endpoints
5. Data seeding with default content
6. Integration tests

### Phase 3: Advanced Features (Week 3-4)
1. Export functionality (PDF, Excel, JSON)
2. Background job processing
3. Caching implementation
4. Sensitivity analysis endpoint
5. Benchmark and template systems

### Phase 4: Polish & Production (Week 4-5)
1. Authentication and authorization (if required)
2. API documentation (Swagger)
3. Performance optimization
4. Logging and monitoring
5. Error handling refinement
6. Security hardening
7. Load testing
8. Deployment configuration

---

## Deployment Architecture

### Recommended Infrastructure

**Development:**
- Local Docker containers (PostgreSQL, Redis)
- Node.js running locally
- Hot reload with nodemon

**Production:**
- **Compute:** AWS ECS/Fargate, Google Cloud Run, or Heroku
- **Database:** AWS RDS PostgreSQL, Google Cloud SQL, or Heroku Postgres
- **Cache:** AWS ElastiCache Redis, Google Cloud Memorystore
- **Storage:** AWS S3 or Google Cloud Storage (for exports)
- **Queue:** AWS SQS + Lambda, or self-hosted Bull
- **Monitoring:** DataDog, New Relic, or CloudWatch
- **CDN:** CloudFront or Cloudflare (for static assets)

### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/shopify_bizcase
REDIS_URL=redis://localhost:6379

# Server
PORT=3001
NODE_ENV=production

# Security
JWT_SECRET=your-secret-key-here
API_KEY=your-api-key-for-external-services

# AWS (for file storage)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

---

## API Response Formats

### Success Response
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "companyName": "Example Corp",
    ...
  },
  "meta": {
    "timestamp": "2026-01-19T10:30:00Z",
    "requestId": "req-123"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "BUSINESS_CASE_NOT_FOUND",
    "message": "Business case with ID 'xyz' does not exist",
    "details": null
  },
  "meta": {
    "timestamp": "2026-01-19T10:30:00Z",
    "requestId": "req-123"
  }
}
```

### List Response (with pagination)
```json
{
  "success": true,
  "data": [
    { "id": "1", ... },
    { "id": "2", ... }
  ],
  "pagination": {
    "total": 145,
    "page": 1,
    "limit": 20,
    "totalPages": 8,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "meta": {
    "timestamp": "2026-01-19T10:30:00Z",
    "requestId": "req-123"
  }
}
```

---

## Sample Data Structures

### Example Business Case Response
```json
{
  "id": "bc-123",
  "companyName": "Example Corp",
  "currentRevenue": 1500000,
  "currentPlatform": "Magento",
  "industry": "retail",
  "grossMargin": 0.30,
  "implementationCost": 50000,
  "status": "active",
  "createdAt": "2026-01-15T10:00:00Z",
  "scenarios": [
    {
      "type": "conservative",
      "year1GrowthRate": 0.20,
      "year2GrowthRate": 0.20,
      "year3GrowthRate": 0.20,
      "revenueProjections": [
        { "year": 0, "revenue": 1500000, "grossProfit": 450000 },
        { "year": 1, "revenue": 1800000, "grossProfit": 540000 },
        { "year": 2, "revenue": 2160000, "grossProfit": 648000 },
        { "year": 3, "revenue": 2592000, "grossProfit": 777600 }
      ],
      "metrics": {
        "paybackPeriod": 10.2,
        "roi3Year": 112,
        "npv": 245000,
        "netBenefit": 68800
      },
      "cashFlowMonthly": [
        { "month": 1, "investment": -25000, "platformCosts": -2500, "returns": 0, "netCashFlow": -27500, "cumulative": -27500 },
        ...
      ]
    },
    {
      "type": "moderate",
      ...
    },
    {
      "type": "aggressive",
      ...
    }
  ],
  "risks": [
    {
      "id": "risk-1",
      "title": "Implementation Delays",
      "category": "technical",
      "probability": "medium",
      "impact": "medium",
      "mitigation": "Fixed-price contract with penalty clauses"
    }
  ],
  "implementationTimeline": [
    {
      "phaseNumber": 1,
      "name": "Discovery & Planning",
      "duration": 2,
      "startWeek": 1,
      "endWeek": 2,
      "cost": 8000,
      "deliverables": ["Project plan", "Technical architecture"]
    }
  ]
}
```

---

## Code Quality Standards

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

### Code Style
- Use ESLint with Airbnb or Standard config
- Prettier for formatting
- Consistent naming conventions:
  - camelCase for variables and functions
  - PascalCase for classes and types
  - UPPER_SNAKE_CASE for constants
- Meaningful variable names (no single letters except loop counters)
- Comment complex business logic

### File Structure
```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   └── env.ts
│   ├── models/           # Database models (Prisma/TypeORM)
│   │   ├── BusinessCase.ts
│   │   ├── Scenario.ts
│   │   ├── Risk.ts
│   │   └── User.ts
│   ├── routes/           # API route handlers
│   │   ├── businessCases.ts
│   │   ├── scenarios.ts
│   │   ├── risks.ts
│   │   ├── exports.ts
│   │   └── auth.ts
│   ├── controllers/      # Business logic
│   │   ├── businessCaseController.ts
│   │   ├── scenarioController.ts
│   │   └── exportController.ts
│   ├── services/         # External services and utilities
│   │   ├── calculationService.ts
│   │   ├── pdfService.ts
│   │   ├── excelService.ts
│   │   ├── cacheService.ts
│   │   └── emailService.ts
│   ├── middleware/       # Express middleware
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   ├── validator.ts
│   │   └── logger.ts
│   ├── utils/            # Helper functions
│   │   ├── calculations.ts
│   │   ├── formatting.ts
│   │   └── validation.ts
│   ├── jobs/             # Background jobs
│   │   ├── pdfGenerator.ts
│   │   ├── excelGenerator.ts
│   │   └── metricsRecalculator.ts
│   ├── types/            # TypeScript type definitions
│   │   ├── models.ts
│   │   ├── api.ts
│   │   └── calculations.ts
│   ├── seeds/            # Database seeders
│   │   ├── benchmarks.ts
│   │   ├── risks.ts
│   │   └── templates.ts
│   ├── tests/            # Test files
│   │   ├── unit/
│   │   ├── integration/
│   │   └── e2e/
│   ├── app.ts            # Express app setup
│   └── server.ts         # Server entry point
├── prisma/               # Prisma schema and migrations
│   ├── schema.prisma
│   └── migrations/
├── docker-compose.yml
├── Dockerfile
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

---

## Success Criteria

Your backend implementation should achieve:

✅ **Functional Completeness**
- All API endpoints from specification implemented
- All financial calculations accurate and tested
- Complete CRUD operations for all models

✅ **Data Integrity**
- Proper database schema with relationships
- Data validation on all inputs
- Transactions for complex operations

✅ **Performance**
- API response times < 200ms for simple queries
- Complex calculations < 500ms
- Proper caching reduces database load by 60%+

✅ **Reliability**
- Error handling for all edge cases
- Graceful degradation when services unavailable
- 99.9% uptime capability

✅ **Security**
- Input sanitization prevents injection attacks
- Authentication and authorization working
- Sensitive data encrypted at rest and in transit

✅ **Maintainability**
- Clean, well-documented code
- Comprehensive test coverage (>80%)
- Clear API documentation
- Easy to extend with new features

✅ **Scalability**
- Can handle 1000+ concurrent users
- Database queries optimized with indexes
- Caching reduces load on database
- Background jobs don't block API requests

---

## Additional Considerations

### Integration with Frontend
- CORS configuration to allow frontend origin
- WebSocket support (if real-time updates needed)
- Consistent data format matching frontend expectations
- Version API endpoints (e.g., `/api/v1/...`) for future changes

### Future Enhancements (Nice to Have)
- **Multi-tenancy:** Support multiple companies/organizations
- **Collaboration:** Multiple users editing same business case
- **Version history:** Track changes to scenarios over time
- **Comparison tool:** Compare multiple business cases side-by-side
- **AI insights:** Use ML to suggest optimizations or flag anomalies
- **Email notifications:** Alert users when exports ready or milestones reached
- **Webhooks:** Notify external systems of business case events
- **Mobile API:** Optimize responses for mobile app consumption

---

## Final Notes

This backend should be:
1. **Production-ready**: Robust error handling, logging, security
2. **Well-tested**: Unit, integration, and E2E tests
3. **Documented**: Clear API docs and code comments
4. **Performant**: Fast responses, efficient queries, smart caching
5. **Maintainable**: Clean code, logical structure, TypeScript types
6. **Scalable**: Can grow from 10 to 10,000 business cases without refactoring

Remember: The frontend is already built and expects this data structure. Ensure your API responses match what the frontend needs to render the interactive dashboard seamlessly.

Build with the understanding that this is a professional business tool for executive decision-making—quality, accuracy, and reliability are paramount.

---

**Your deliverables:**
1. Complete backend application with all endpoints
2. Database schema and migrations
3. Seeded data for testing
4. API documentation (Swagger)
5. README with setup instructions
6. Docker configuration for easy deployment
7. Test suite with >80% coverage
8. Environment configuration examples

Good luck! Build something robust and elegant. 🚀
