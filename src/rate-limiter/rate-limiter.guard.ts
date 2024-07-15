import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IRateLimiterService } from './type';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject('RATE_LIMITER_SERVICE')
    private rateLimiterService: IRateLimiterService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const handler = context.getHandler();
    const rateLimit = this.reflector.get<{
      limit: number;
      timeWindow: number;
      keyFunction?: (request: any) => string;
    }>('rateLimit', handler);

    if (!rateLimit) {
      return true;
    }

    const key = rateLimit.keyFunction
      ? rateLimit.keyFunction(request)
      : this.rateLimiterService.getKey(request);

    return this.rateLimiterService.isAllowed(
      key,
      rateLimit.limit,
      rateLimit.timeWindow,
    );
  }
}
