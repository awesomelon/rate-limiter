import { DynamicModule, Module } from '@nestjs/common';
import { RateLimiterService } from './services';
import { RateLimitGuard } from './guards';
import { RATE_LIMITER_SERVICE } from './types';
import { CacheServiceFactory } from './cache';
import { ICacheOptions } from './cache/cache-service.interface';

export interface RateLimiterModuleOptions {
  cacheType?: 'memory' | 'redis';
  cacheOptions?: ICacheOptions;
}

@Module({})
export class RateLimiterModule {
  static register(options: RateLimiterModuleOptions = {}): DynamicModule {
    return {
      module: RateLimiterModule,
      providers: [
        CacheServiceFactory,
        {
          provide: 'CACHE_SERVICE',
          useFactory: (cacheServiceFactory: CacheServiceFactory) => {
            return cacheServiceFactory.create(
              options.cacheType || 'memory',
              options.cacheOptions || {},
            );
          },
          inject: [CacheServiceFactory],
        },
        {
          provide: RATE_LIMITER_SERVICE,
          useClass: RateLimiterService,
        },
        RateLimitGuard,
      ],
      exports: [RATE_LIMITER_SERVICE],
    };
  }
}
