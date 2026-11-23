import { Redis } from 'ioredis';
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { logger } from './logger.js';

const CONNECT_TIMEOUT_MS = 10_000;

let redis: Redis | undefined;

/** The Redis client, or undefined when REDIS_URL is not set. */
export function getRedis(): Redis | undefined {
  return redis;
}

async function connectRedis(url: string): Promise<Redis> {
  const client = new Redis(url, {
    connectTimeout: CONNECT_TIMEOUT_MS,
    maxRetriesPerRequest: 1,
  });
  client.on('error', (error: unknown) => {
    logger.error({ error }, 'Redis error');
  });

  try {
    await client.ping();
  } catch (error) {
    client.disconnect();
    throw error;
  }
  return client;
}

export async function connectDatabases(): Promise<void> {
  if (!env.MONGODB_URI) {
    throw new Error('MONGODB_URI is required (see backend/.env.example)');
  }

  await mongoose.connect(env.MONGODB_URI, {
    serverSelectionTimeoutMS: CONNECT_TIMEOUT_MS,
  });
  logger.info({ database: mongoose.connection.name }, 'MongoDB connected');

  if (!env.REDIS_URL) {
    logger.warn('REDIS_URL is not set; running without Redis');
    return;
  }

  try {
    redis = await connectRedis(env.REDIS_URL);
  } catch (error) {
    await mongoose.disconnect();
    throw error;
  }
  logger.info('Redis connected');
}

export async function disconnectDatabases(): Promise<void> {
  await mongoose.disconnect();
  if (redis) {
    await redis.quit();
    redis = undefined;
  }
}
