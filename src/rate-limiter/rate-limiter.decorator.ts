import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { RateLimitGuard } from './rate-limiter.guard';

export const RateLimit = (
  limit: number,
  timeWindow: number,
  keyFunction?: (request: any) => string,
) => {
  return applyDecorators(
    SetMetadata('rateLimit', { limit, timeWindow, keyFunction }),
    UseGuards(RateLimitGuard),
  );
};
