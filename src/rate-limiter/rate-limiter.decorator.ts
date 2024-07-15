import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { RateLimitGuard } from './rate-limiter.guard';
import { META_DATA_KEY } from './type';

export const RateLimit = (
  limit: number,
  timeWindow: number,
  keyFunction?: (request: any) => string,
) => {
  console.log('limit', limit);
  console.log('timeWindow', timeWindow);
  console.log('keyFunction', keyFunction);

  return applyDecorators(
    SetMetadata(META_DATA_KEY, { limit, timeWindow, keyFunction }),
    UseGuards(RateLimitGuard),
  );
};
