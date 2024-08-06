import { Injectable } from '@nestjs/common';
import { ICacheService } from './cache-service.interface';
import { RedisCacheService } from './redis-cache.service';
import { InMemoryCacheService } from './in-memory-cache.service';

@Injectable()
export class CacheServiceFactory {
  create(type: string): ICacheService {
    switch (type) {
      case 'memory':
        return new InMemoryCacheService();
      case 'redis':
        return new RedisCacheService();
      default:
        throw new Error('Invalid cache type');
    }
  }
}
