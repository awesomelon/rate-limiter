import { Module } from '@nestjs/common';
import { RateLimiterService, RedisRateLimiterService } from './services';
import { RateLimitGuard } from './guards';
import { RATE_LIMITER_SERVICE } from './types';

@Module({
  providers: [
    {
      provide: RATE_LIMITER_SERVICE,
      useClass:
        process.env.USE_REDIS === 'true'
          ? RedisRateLimiterService
          : RateLimiterService,
    },
    RateLimitGuard,
  ],
  exports: [RATE_LIMITER_SERVICE],
})
export class RateLimiterModule {}
