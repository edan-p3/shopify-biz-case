import { createClient } from 'redis';
import config from './env';
import logger from '../utils/logger';

let redisClient: ReturnType<typeof createClient>;
let isRedisConnected = false;

try {
  redisClient = createClient({
    url: config.redisUrl,
    socket: {
      connectTimeout: 5000,
      reconnectStrategy: () => false, // Disable auto-reconnect
    },
  });

  redisClient.on('error', (err) => {
    logger.error('Redis Client Error:', err);
  });

  redisClient.on('connect', () => {
    logger.info('Redis Client Connected');
    isRedisConnected = true;
  });

  redisClient.on('ready', () => {
    logger.info('Redis Client Ready');
  });
} catch (error) {
  logger.error('Failed to create Redis client:', error);
  // Create a mock client that does nothing
  redisClient = {
    ping: async () => 'PONG',
    quit: async () => {},
  } as any;
}

export const connectRedis = async () => {
  try {
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Redis connection timeout')), 3000)
    );
    
    await Promise.race([redisClient.connect(), timeout]);
    isRedisConnected = true;
  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
    logger.warn('Server will continue without Redis. Caching and background jobs will be unavailable.');
    isRedisConnected = false;
    // Don't throw - allow server to start without Redis
  }
};

export { isRedisConnected };

export default redisClient;
