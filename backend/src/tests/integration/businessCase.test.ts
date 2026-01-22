import request from 'supertest';
import app from '../../app';
import prisma from '../../config/database';

describe('Business Case API Integration Tests', () => {
  let createdBusinessCaseId: string;

  beforeAll(async () => {
    // Setup: ensure database is ready
    await prisma.$connect();
  });

  afterAll(async () => {
    // Cleanup: remove test data
    if (createdBusinessCaseId) {
      await prisma.businessCase.delete({
        where: { id: createdBusinessCaseId },
      });
    }
    await prisma.$disconnect();
  });

  describe('POST /api/business-cases', () => {
    it('should create a new business case with default scenarios', async () => {
      const response = await request(app)
        .post('/api/business-cases')
        .send({
          companyName: 'Test Corp',
          currentRevenue: 1500000,
          currentPlatform: 'Magento',
          industry: 'retail',
          currentPlatformCost: 30000,
          operationalCosts: {
            revenueLeakage: 45000,
            operationalInefficiency: 60000,
            integrationMaintenance: 24000,
            manualProcessing: 36000,
          },
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.companyName).toBe('Test Corp');
      expect(response.body.data.scenarios).toHaveLength(3);

      createdBusinessCaseId = response.body.data.id;
    });

    it('should return 400 for invalid data', async () => {
      const response = await request(app)
        .post('/api/business-cases')
        .send({
          companyName: 'T', // Too short
          currentRevenue: -1000, // Negative
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('GET /api/business-cases/:id', () => {
    it('should return a business case with all scenarios', async () => {
      if (!createdBusinessCaseId) {
        throw new Error('No business case created for testing');
      }

      const response = await request(app).get(
        `/api/business-cases/${createdBusinessCaseId}`
      );

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.scenarios).toHaveLength(3);
      expect(response.body.data).toHaveProperty('operationalCosts');
      expect(response.body.data).toHaveProperty('implementationTimeline');
    });

    it('should return 404 for non-existent business case', async () => {
      const response = await request(app).get(
        '/api/business-cases/00000000-0000-0000-0000-000000000000'
      );

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/business-cases', () => {
    it('should list business cases with pagination', async () => {
      const response = await request(app)
        .get('/api/business-cases')
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.pagination).toHaveProperty('total');
      expect(response.body.pagination).toHaveProperty('page');
      expect(response.body.pagination).toHaveProperty('limit');
    });
  });

  describe('PUT /api/business-cases/:id', () => {
    it('should update a business case', async () => {
      if (!createdBusinessCaseId) {
        throw new Error('No business case created for testing');
      }

      const response = await request(app)
        .put(`/api/business-cases/${createdBusinessCaseId}`)
        .send({
          companyName: 'Updated Test Corp',
          status: 'ACTIVE',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.companyName).toBe('Updated Test Corp');
    });
  });
});
