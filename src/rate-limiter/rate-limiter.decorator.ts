import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { RateLimitGuard } from './rate-limiter.guard';

export const RateLimit = (limit: number, timeWindow: number) => {
  return applyDecorators(
    SetMetadata('rateLimit', { limit, timeWindow }),
    UseGuards(RateLimitGuard),
  );
};
