# Shopify Business Case Backend API

A robust, scalable backend system for the Shopify Business Case Analysis Platform. Built with Node.js, TypeScript, Express, PostgreSQL, and Redis.

## Features

- ✅ RESTful API with comprehensive endpoints
- ✅ PostgreSQL database with Prisma ORM
- ✅ Redis caching for performance
- ✅ JWT authentication (optional)
- ✅ Financial calculation engine
- ✅ Input validation with Joi
- ✅ Error handling and logging
- ✅ Rate limiting
- ✅ Docker support
- ✅ Comprehensive testing setup
- ✅ API documentation ready

## Tech Stack

- **Runtime:** Node.js 18+
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL 15
- **Cache:** Redis 7
- **ORM:** Prisma
- **Authentication:** JWT
- **Validation:** Joi
- **Logging:** Winston
- **Testing:** Jest
- **Containerization:** Docker

## Prerequisites

- Node.js 18 or higher
- PostgreSQL 15 or higher
- Redis 7 or higher
- npm or yarn

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file in the backend directory:

```bash
# Server
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/shopify_bizcase

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:3000
```

### 3. Start Services with Docker (Recommended)

```bash
# Start PostgreSQL and Redis
docker-compose up -d postgres redis
```

Or install PostgreSQL and Redis locally.

### 4. Database Setup

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database with sample data
npm run prisma:seed
```

### 5. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## API Endpoints

### Health Check

```
GET /api/health
```

### Business Cases

```
GET    /api/business-cases              # List all business cases
GET    /api/business-cases/:id          # Get business case by ID
POST   /api/business-cases              # Create new business case
PUT    /api/business-cases/:id          # Update business case
DELETE /api/business-cases/:id          # Archive business case
```

### Scenarios

```
GET  /api/business-cases/:id/scenarios                                    # Get all scenarios
GET  /api/business-cases/:id/scenarios/:scenarioType                      # Get specific scenario
PUT  /api/business-cases/:id/scenarios/:scenarioType                      # Update scenario
GET  /api/business-cases/:id/scenarios/:scenarioType/revenue-projections  # Revenue projections
GET  /api/business-cases/:id/scenarios/:scenarioType/cash-flow            # Cash flow analysis
GET  /api/business-cases/:id/scenarios/:scenarioType/roi                  # ROI metrics
POST /api/business-cases/:id/scenarios/:scenarioType/sensitivity-analysis # Sensitivity analysis
```

### Risks

```
GET    /api/business-cases/:id/risks           # Get all risks
POST   /api/business-cases/:id/risks           # Create new risk
PUT    /api/business-cases/:id/risks/:riskId   # Update risk
DELETE /api/business-cases/:id/risks/:riskId   # Delete risk
GET    /api/business-cases/:id/risk-matrix     # Risk matrix visualization
```

### Exports

```
POST /api/business-cases/:id/export      # Generate export (PDF/Excel/JSON)
GET  /api/exports/:jobId                 # Get export status
GET  /api/exports/:jobId/download        # Download export
POST /api/business-cases/:id/share       # Generate shareable link
```

### Authentication

```
POST /api/auth/register    # Register new user
POST /api/auth/login       # Login user
GET  /api/auth/profile     # Get user profile (requires auth)
```

## Example Requests

### Create Business Case

```bash
curl -X POST http://localhost:3001/api/business-cases \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Example Corp",
    "currentRevenue": 1500000,
    "currentPlatform": "Magento",
    "industry": "retail",
    "currentPlatformCost": 30000,
    "operationalCosts": {
      "revenueLeakage": 45000,
      "operationalInefficiency": 60000,
      "integrationMaintenance": 24000,
      "manualProcessing": 36000
    }
  }'
```

### Get Business Case

```bash
curl http://localhost:3001/api/business-cases/{id}
```

### Update Scenario

```bash
curl -X PUT http://localhost:3001/api/business-cases/{id}/scenarios/moderate \
  -H "Content-Type: application/json" \
  -d '{
    "year1GrowthRate": 0.30,
    "year2GrowthRate": 0.28,
    "year3GrowthRate": 0.25
  }'
```

## Development

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Database Management

```bash
# Open Prisma Studio (database GUI)
npm run prisma:studio

# Create new migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset
```

### Linting

```bash
# Run ESLint
npm run lint

# Fix linting issues
npm run lint:fix
```

### Build for Production

```bash
npm run build
npm start
```

## Docker Deployment

### Build and Run All Services

```bash
docker-compose up -d
```

This starts:
- PostgreSQL database
- Redis cache
- Backend API

### View Logs

```bash
docker-compose logs -f backend
```

### Stop Services

```bash
docker-compose down
```

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Database seeding
│   └── migrations/            # Migration files
├── src/
│   ├── config/                # Configuration files
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   └── env.ts
│   ├── controllers/           # Request handlers
│   │   ├── businessCaseController.ts
│   │   ├── scenarioController.ts
│   │   ├── riskController.ts
│   │   ├── exportController.ts
│   │   └── authController.ts
│   ├── middleware/            # Express middleware
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   ├── rateLimiter.ts
│   │   └── requestLogger.ts
│   ├── routes/                # API routes
│   │   ├── businessCases.ts
│   │   ├── scenarios.ts
│   │   ├── risks.ts
│   │   ├── exports.ts
│   │   ├── auth.ts
│   │   └── index.ts
│   ├── services/              # Business logic
│   │   ├── calculationService.ts
│   │   └── cacheService.ts
│   ├── types/                 # TypeScript types
│   │   ├── models.ts
│   │   └── api.ts
│   ├── utils/                 # Utility functions
│   │   ├── calculations.ts
│   │   ├── validation.ts
│   │   └── logger.ts
│   ├── app.ts                 # Express app setup
│   └── server.ts              # Server entry point
├── logs/                      # Log files
├── tests/                     # Test files
├── .env                       # Environment variables
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── package.json
├── tsconfig.json
└── README.md
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment | `development` |
| `DATABASE_URL` | PostgreSQL connection string | - |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | JWT expiration | `7d` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |

## Performance Optimization

### Caching Strategy

The API uses Redis for caching:

- **Calculated Metrics:** 1 hour TTL
- **Benchmarks:** 24 hours TTL
- **Business Cases:** 5 minutes TTL
- **Exports:** 24 hours TTL

Caches are automatically invalidated when data is updated.

### Database Optimization

- Indexes on frequently queried fields
- Connection pooling
- Eager loading for related data
- Efficient query patterns

### Rate Limiting

- General API: 100 requests per 15 minutes
- Authentication: 5 attempts per 15 minutes
- Exports: 10 requests per hour

## Security Features

- Helmet.js for security headers
- CORS configuration
- JWT authentication
- Input validation and sanitization
- Rate limiting
- SQL injection prevention (Prisma)
- XSS protection

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "BUSINESS_CASE_NOT_FOUND",
    "message": "Business case with ID 'xyz' not found",
    "details": null
  },
  "meta": {
    "timestamp": "2026-01-22T10:30:00Z",
    "requestId": "req-123"
  }
}
```

## Logging

Logs are written to:
- `logs/combined.log` - All logs
- `logs/error.log` - Error logs only
- Console - Development environment

## Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker-compose ps

# View PostgreSQL logs
docker-compose logs postgres

# Test connection
npx prisma db pull
```

### Redis Connection Issues

```bash
# Check if Redis is running
docker-compose ps

# Test Redis connection
redis-cli ping
```

### Port Already in Use

```bash
# Find process using port 3001
lsof -i :3001

# Kill process
kill -9 <PID>
```

## Contributing

1. Follow the existing code style
2. Write tests for new features
3. Update documentation
4. Run linting before committing

## License

ISC

## Support

For issues and questions, please open an issue on the repository.
