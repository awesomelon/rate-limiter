import { Injectable } from '@nestjs/common';
import { ICacheOptions, ICacheService } from './cache-service.interface';
import { RedisCacheService } from './redis-cache.service';
import { InMemoryCacheService } from './in-memory-cache.service';

@Injectable()
export class CacheServiceFactory {
  create(type: string, options: ICacheOptions): ICacheService {
    switch (type) {
      case 'memory':
        return new InMemoryCacheService();
      case 'redis':
        return new RedisCacheService(options);
      default:
        throw new Error(`Unsupported cache type: ${type}`);
    }
  }
}
