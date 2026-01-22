import { Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AuthRequest, APIResponse } from '../types/api';
import { AppError } from '../middleware/errorHandler';
import cacheService from '../services/cacheService';
import logger from '../utils/logger';

class RiskController {
  /**
   * Get all risks for a business case
   */
  async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const risks = await prisma.risk.findMany({
        where: { businessCaseId: id },
        orderBy: { createdAt: 'desc' },
      });

      const response: APIResponse = {
        success: true,
        data: risks,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: req.headers['x-request-id'] as string,
        },
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new risk
   */
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const riskData = req.body;

      const risk = await prisma.risk.create({
        data: {
          businessCaseId: id,
          ...riskData,
        },
      });

      // Invalidate cache
      await cacheService.invalidateBusinessCase(id);

      logger.info('Risk created', {
        riskId: risk.id,
        businessCaseId: id,
        userId: req.user?.id,
      });

      const response: APIResponse = {
        success: true,
        data: risk,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: req.headers['x-request-id'] as string,
        },
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a risk
   */
  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id, riskId } = req.params;
      const updateData = req.body;

      const risk = await prisma.risk.update({
        where: { id: riskId },
        data: updateData,
      });

      // Invalidate cache
      await cacheService.invalidateBusinessCase(id);

      logger.info('Risk updated', {
        riskId,
        businessCaseId: id,
        userId: req.user?.id,
      });

      const response: APIResponse = {
        success: true,
        data: risk,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: req.headers['x-request-id'] as string,
        },
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a risk
   */
  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id, riskId } = req.params;

      await prisma.risk.delete({
        where: { id: riskId },
      });

      // Invalidate cache
      await cacheService.invalidateBusinessCase(id);

      logger.info('Risk deleted', {
        riskId,
        businessCaseId: id,
        userId: req.user?.id,
      });

      const response: APIResponse = {
        success: true,
        data: { message: 'Risk deleted successfully' },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: req.headers['x-request-id'] as string,
        },
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get risk matrix visualization data
   */
  async getRiskMatrix(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const risks = await prisma.risk.findMany({
        where: { businessCaseId: id },
      });

      // Group risks by probability and impact
      const matrix = {
        low_low: risks.filter((r) => r.probability === 'LOW' && r.impact === 'LOW'),
        low_medium: risks.filter((r) => r.probability === 'LOW' && r.impact === 'MEDIUM'),
        low_high: risks.filter((r) => r.probability === 'LOW' && r.impact === 'HIGH'),
        medium_low: risks.filter((r) => r.probability === 'MEDIUM' && r.impact === 'LOW'),
        medium_medium: risks.filter((r) => r.probability === 'MEDIUM' && r.impact === 'MEDIUM'),
        medium_high: risks.filter((r) => r.probability === 'MEDIUM' && r.impact === 'HIGH'),
        high_low: risks.filter((r) => r.probability === 'HIGH' && r.impact === 'LOW'),
        high_medium: risks.filter((r) => r.probability === 'HIGH' && r.impact === 'MEDIUM'),
        high_high: risks.filter((r) => r.probability === 'HIGH' && r.impact === 'HIGH'),
      };

      const response: APIResponse = {
        success: true,
        data: {
          matrix,
          summary: {
            total: risks.length,
            byCategory: {
              technical: risks.filter((r) => r.category === 'TECHNICAL').length,
              financial: risks.filter((r) => r.category === 'FINANCIAL').length,
              operational: risks.filter((r) => r.category === 'OPERATIONAL').length,
              strategic: risks.filter((r) => r.category === 'STRATEGIC').length,
            },
            byStatus: {
              identified: risks.filter((r) => r.status === 'IDENTIFIED').length,
              mitigated: risks.filter((r) => r.status === 'MITIGATED').length,
              accepted: risks.filter((r) => r.status === 'ACCEPTED').length,
              resolved: risks.filter((r) => r.status === 'RESOLVED').length,
            },
          },
        },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: req.headers['x-request-id'] as string,
        },
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default new RiskController();
