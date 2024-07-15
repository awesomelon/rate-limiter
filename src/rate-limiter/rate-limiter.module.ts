import { Module } from '@nestjs/common';
import { RateLimiterService } from './rate-limiter.service';
import { RedisRateLimiterService } from './rate-limiter.redis.service';
import { RateLimitGuard } from './rate-limiter.guard';

@Module({
  providers: [
    {
      provide: 'RATE_LIMITER_SERVICE',
      useClass:
        process.env.USE_REDIS === 'true'
          ? RedisRateLimiterService
          : RateLimiterService,
    },
    RateLimitGuard,
  ],
  exports: ['RATE_LIMITER_SERVICE'],
})
export class RateLimiterModule {}
