import redisClient from '../config/redis';
import logger from '../utils/logger';

class CacheService {
  private TTL = {
    METRICS: 3600, // 1 hour
    BENCHMARKS: 86400, // 24 hours
    BUSINESS_CASE: 300, // 5 minutes
    EXPORT: 86400, // 24 hours
  };

  /**
   * Get cached data
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redisClient.get(key);
      if (!data) return null;

      return JSON.parse(data) as T;
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  }

  /**
   * Set cached data
   */
  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      if (ttl) {
        await redisClient.setEx(key, ttl, serialized);
      } else {
        await redisClient.set(key, serialized);
      }
    } catch (error) {
      logger.error('Cache set error:', error);
    }
  }

  /**
   * Delete cached data
   */
  async delete(key: string): Promise<void> {
    try {
      await redisClient.del(key);
    } catch (error) {
      logger.error('Cache delete error:', error);
    }
  }

  /**
   * Delete multiple keys by pattern
   */
  async deletePattern(pattern: string): Promise<void> {
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    } catch (error) {
      logger.error('Cache delete pattern error:', error);
    }
  }

  /**
   * Cache business case metrics
   */
  async cacheMetrics(
    businessCaseId: string,
    scenarioType: string,
    metrics: any
  ): Promise<void> {
    const key = `businessCase:${businessCaseId}:scenario:${scenarioType}:metrics`;
    await this.set(key, metrics, this.TTL.METRICS);
  }

  /**
   * Get cached business case metrics
   */
  async getMetrics(
    businessCaseId: string,
    scenarioType: string
  ): Promise<any | null> {
    const key = `businessCase:${businessCaseId}:scenario:${scenarioType}:metrics`;
    return await this.get(key);
  }

  /**
   * Invalidate business case cache
   */
  async invalidateBusinessCase(businessCaseId: string): Promise<void> {
    await this.deletePattern(`businessCase:${businessCaseId}:*`);
  }

  /**
   * Cache full business case
   */
  async cacheBusinessCase(businessCaseId: string, data: any): Promise<void> {
    const key = `businessCase:${businessCaseId}:full`;
    await this.set(key, data, this.TTL.BUSINESS_CASE);
  }

  /**
   * Get cached business case
   */
  async getBusinessCase(businessCaseId: string): Promise<any | null> {
    const key = `businessCase:${businessCaseId}:full`;
    return await this.get(key);
  }

  /**
   * Cache benchmarks
   */
  async cacheBenchmarks(industry: string, data: any): Promise<void> {
    const key = `benchmarks:${industry}`;
    await this.set(key, data, this.TTL.BENCHMARKS);
  }

  /**
   * Get cached benchmarks
   */
  async getBenchmarks(industry: string): Promise<any | null> {
    const key = `benchmarks:${industry}`;
    return await this.get(key);
  }

  /**
   * Cache export result
   */
  async cacheExport(exportId: string, data: any): Promise<void> {
    const key = `export:${exportId}`;
    await this.set(key, data, this.TTL.EXPORT);
  }

  /**
   * Get cached export
   */
  async getExport(exportId: string): Promise<any | null> {
    const key = `export:${exportId}`;
    return await this.get(key);
  }

  /**
   * Check if Redis is connected
   */
  async isConnected(): Promise<boolean> {
    try {
      await redisClient.ping();
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default new CacheService();
