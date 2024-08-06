import { Module } from '@nestjs/common';
import { RateLimiterService } from './services';
import { RateLimitGuard } from './guards';
import { RATE_LIMITER_SERVICE } from './types';
import { CacheServiceFactory } from './cache';
import * as process from 'node:process';

@Module({
  providers: [
    CacheServiceFactory,
    {
      provide: 'CACHE_SERVICE',
      useFactory: (cacheServiceFactory: CacheServiceFactory) => {
        return cacheServiceFactory.create(process.env.CACHE_TYPE || 'memory');
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
})
export class RateLimiterModule {}
