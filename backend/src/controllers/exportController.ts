import { Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AuthRequest, APIResponse } from '../types/api';
import { AppError } from '../middleware/errorHandler';
import logger from '../utils/logger';

class ExportController {
  /**
   * Generate export (PDF, Excel, JSON)
   */
  async generateExport(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { type, scenario } = req.body;

      // Create export job
      const exportJob = await prisma.export.create({
        data: {
          businessCaseId: id,
          userId: req.user?.id,
          type: type.toUpperCase(),
          scenario: scenario?.toUpperCase(),
          status: 'PENDING',
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        },
      });

      // In a real implementation, this would queue a background job
      // For now, we'll mark it as processing and generate synchronously

      logger.info('Export job created', {
        exportId: exportJob.id,
        businessCaseId: id,
        type,
        userId: req.user?.id,
      });

      // Simulate async processing
      setTimeout(async () => {
        try {
          await prisma.export.update({
            where: { id: exportJob.id },
            data: {
              status: 'COMPLETED',
              fileUrl: `https://storage.example.com/exports/${exportJob.id}.${type.toLowerCase()}`,
            },
          });
        } catch (error) {
          logger.error('Export job failed:', error);
        }
      }, 3000);

      const response: APIResponse = {
        success: true,
        data: {
          jobId: exportJob.id,
          status: exportJob.status,
          statusUrl: `/api/exports/${exportJob.id}`,
        },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: req.headers['x-request-id'] as string,
        },
      };

      res.status(202).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get export job status
   */
  async getExportStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { jobId } = req.params;

      const exportJob = await prisma.export.findUnique({
        where: { id: jobId },
      });

      if (!exportJob) {
        throw new AppError(
          404,
          'BUSINESS_CASE_NOT_FOUND',
          `Export job ${jobId} not found`
        );
      }

      const response: APIResponse = {
        success: true,
        data: {
          jobId: exportJob.id,
          status: exportJob.status,
          fileUrl: exportJob.fileUrl,
          downloadUrl:
            exportJob.status === 'COMPLETED'
              ? `/api/exports/${jobId}/download`
              : null,
          expiresAt: exportJob.expiresAt,
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

  /**
   * Download export file
   */
  async downloadExport(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { jobId } = req.params;

      const exportJob = await prisma.export.findUnique({
        where: { id: jobId },
      });

      if (!exportJob) {
        throw new AppError(
          404,
          'BUSINESS_CASE_NOT_FOUND',
          `Export job ${jobId} not found`
        );
      }

      if (exportJob.status !== 'COMPLETED') {
        throw new AppError(
          400,
          'EXPORT_GENERATION_FAILED',
          'Export is not ready for download'
        );
      }

      if (new Date() > exportJob.expiresAt) {
        throw new AppError(
          410,
          'EXPORT_GENERATION_FAILED',
          'Export has expired'
        );
      }

      // In a real implementation, this would stream from S3 or file storage
      // For now, return a placeholder response
      res.json({
        success: true,
        message: 'In production, this would stream the file',
        fileUrl: exportJob.fileUrl,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generate shareable link
   */
  async generateShareLink(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { expiresIn, scenario } = req.body;

      // Verify business case exists
      const businessCase = await prisma.businessCase.findUnique({
        where: { id },
      });

      if (!businessCase) {
        throw new AppError(
          404,
          'BUSINESS_CASE_NOT_FOUND',
          `Business case ${id} not found`
        );
      }

      // Create a shareable token (in production, use proper token generation)
      const shareToken = Buffer.from(`${id}:${Date.now()}`).toString('base64');
      const expiresAt = new Date(Date.now() + expiresIn * 1000);

      logger.info('Share link generated', {
        businessCaseId: id,
        expiresAt,
        userId: req.user?.id,
      });

      const response: APIResponse = {
        success: true,
        data: {
          shareUrl: `${process.env.FRONTEND_URL}/shared/${shareToken}`,
          expiresAt,
          scenario,
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

export default new ExportController();
