import { Module } from '@nestjs/common';
import { RateLimitService } from './rate-limit.service';
import { RateLimitStore } from './rate-limit.store';
import { RateLimitInterceptor } from './rate-limit.interceptor';

@Module({
  providers: [RateLimitInterceptor, RateLimitService, RateLimitStore],
  exports: [RateLimitInterceptor, RateLimitService],
})
export class RateLimitModule {}
