import { createClient, RedisClientType } from 'redis';
import { config } from './env.config';

let redisClient: RedisClientType;

export const getRedisClient = async (): Promise<RedisClientType> => {
  if (!redisClient) {
    redisClient = createClient({
      url: config.redisUrl
    });

    redisClient.on('error', (err) => {
      console.error('Redis Client Error', err);
    });

    await redisClient.connect();
  }

  return redisClient;
};

export const setCache = async (key: string, value: any, ttl?: number): Promise<void> => {
  const client = await getRedisClient();
  const serializedValue = JSON.stringify(value);

  if (ttl) {
    await client.setEx(key, ttl, serializedValue);
  } else {
    await client.set(key, serializedValue);
  }
};

export const getCache = async (key: string): Promise<any | null> => {
  const client = await getRedisClient();
  const value = await client.get(key);

  if (value) {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  return null;
};

export const deleteCache = async (key: string): Promise<void> => {
  const client = await getRedisClient();
  await client.del(key);
};

export const closeRedisConnection = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
  }
};