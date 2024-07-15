import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { IRateLimiterService } from './type';

@Injectable()
export class RedisRateLimiterService implements IRateLimiterService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis();
  }

  getKey(request: any): string {
    return request.ip;
  }

  async isAllowed(
    key: string,
    limit: number,
    timeWindow: number,
  ): Promise<boolean> {
    const now = Date.now();
    const windowStart = now - timeWindow;

    await this.redis.zremrangebyscore(key, 0, windowStart);
    const count = await this.redis.zcard(key);

    if (count >= limit) {
      return false;
    }

    await this.redis.zadd(key, now, now.toString());
    return true;
  }
}
