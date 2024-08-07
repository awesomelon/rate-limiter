import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  IRateLimiterService,
  META_DATA_KEY,
  RATE_LIMITER_SERVICE,
} from '../types';
import { Request } from 'express';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(RATE_LIMITER_SERVICE)
    private rateLimiterService: IRateLimiterService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const handler = context.getHandler();
    const rateLimit = this.reflector.get<{
      limit: number;
      timeWindow: number;
      keyFunction?: (request: Request) => string;
    }>(META_DATA_KEY, handler);

    if (!rateLimit) {
      return true;
    }

    const key = rateLimit.keyFunction
      ? rateLimit.keyFunction(request)
      : this.rateLimiterService.getKey(request);

    const isAllowed = await this.rateLimiterService.isAllowed(
      key,
      rateLimit.limit,
      rateLimit.timeWindow,
    );

    if (!isAllowed) {
      throw new HttpException(
        'Too Many Requests',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}
