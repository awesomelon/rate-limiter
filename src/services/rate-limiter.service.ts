import { Inject, Injectable } from '@nestjs/common';
import { IRateLimiterService } from '../types';
import { ICacheService } from '../cache/cache-service.interface';
import { Request } from 'express';

@Injectable()
export class RateLimiterService implements IRateLimiterService {
  constructor(@Inject('CACHE_SERVICE') private cacheService: ICacheService) {}

  getKey(request: Request): string {
    return request.ip;
  }

  async isAllowed(
    key: string,
    limit: number,
    timeWindow: number,
  ): Promise<boolean> {
    const currentCount = await this.cacheService.get(key);

    if (currentCount === null) {
      await this.cacheService.set(key, '1', timeWindow);
      return true;
    }

    const count = parseInt(currentCount, 10) + 1;
    await this.cacheService.set(key, count.toString(), timeWindow);

    return count <= limit;
  }
}
