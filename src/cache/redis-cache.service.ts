import { Injectable } from '@nestjs/common';
import { ICacheService } from './cache-service.interface';
import Redis from 'ioredis';

@Injectable()
export class RedisCacheService implements ICacheService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis(
      Number(process.env.REDIS_PORT),
      process.env.REDIS_HOST,
    );
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async set(key: string, value: string, ttl: number): Promise<void> {
    await this.redis.set(key, value, 'PX', ttl);
  }

  async clear(): Promise<void> {
    await this.redis.flushdb();
  }
}
