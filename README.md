# NestJS Rate Limiter

This project provides a rate limiter implementation for NestJS, allowing easy application of rate limits on routes using a decorator. It supports both in-memory and Redis-based storage for rate limiting data, and allows users to customize the key used for rate limiting.



## Features

- Easy-to-use decorator for applying rate limits on routes
- ports multiple storage backends (Redis, in-memory)
- ows custom key generation functions for rate limiting

## Installation

To get started, clone the repository and install the dependencies:
```bash
$ npm install simply-nestjs-rate-limiter
```

## Configuration
Set up environment variables to choose the storage backend. By default, it uses in-memory storage. To use Redis, set the USE_REDIS environment variable to true.
```dotenv
USE_REDIS=true
REDIS_HOST=localhost
REDIS_PORT=6379
```

## Usage

1.	**Rate Limit Decorator**

The RateLimit decorator applies rate limiting to routes. It accepts limit, timeWindow, and an optional keyFunction.
```typescript
import { Controller, Get } from '@nestjs/common';
import { RateLimit } from './rate-limiter.decorator';

@Controller('test')
export class TestController {
  @Get()
  @RateLimit(5, 60000) // 5 requests per minute, default key (IP)
  getTest() {
    return 'This is a rate-limited endpoint';
  }

  @Get('custom')
  @RateLimit(5, 60000, (req) => req.headers['user-agent']) // 5 requests per minute, custom key (User-Agent)
  getCustomTest() {
    return 'This is a custom rate-limited endpoint';
  }
}
```

2.	**Rate Limit Guard**

The RateLimitGuard handles the logic for enforcing rate limits using the specified storage backend and key.
```typescript
import { CanActivate, ExecutionContext, Injectable, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IRateLimiterService } from './rate-limiter.interface';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject('RATE_LIMITER_SERVICE') private rateLimiterService: IRateLimiterService,
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

    const key = rateLimit.keyFunction ? rateLimit.keyFunction(request) : this.rateLimiterService.getKey(request);
    return this.rateLimiterService.isAllowed(key, rateLimit.limit, rateLimit.timeWindow);
  }
}
```

3. **Rate Limiter Services**

Two rate limiter services are provided: an in-memory service and a Redis-based service. Both services implement the IRateLimiterService interface.

- **In-Memory Service**
```typescript
import { Injectable } from '@nestjs/common';
import { IRateLimiterService } from './rate-limiter.interface';

@Injectable()
export class RateLimiterService implements IRateLimiterService {
  private store: Map<string, number[]> = new Map();

  getKey(request: any): string {
    return request.ip;
  }

  async isAllowed(key: string, limit: number, timeWindow: number): Promise<boolean> {
    const now = Date.now();
    if (!this.store.has(key)) {
      this.store.set(key, []);
    }

    const timestamps = this.store.get(key);
    const validTimestamps = timestamps.filter(timestamp => now - timestamp < timeWindow);

    if (validTimestamps.length >= limit) {
      return false;
    }

    validTimestamps.push(now);
    this.store.set(key, validTimestamps);
    return true;
  }
}
```

- **Redis Service**
```typescript
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { IRateLimiterService } from './rate-limiter.interface';

@Injectable()
export class RedisRateLimiterService implements IRateLimiterService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis(); // Configure Redis connection as needed
  }

  getKey(request: any): string {
    return request.ip;
  }

  async isAllowed(key: string, limit: number, timeWindow: number): Promise<boolean> {
    const now = Date.now();
    const windowStart = now - timeWindow;

    await this.redis.zremrangebyscore(key, 0, windowStart);
    const count = await this.redis.zcard(key);

    if (count >= limit) {
      return false;
    }

    await this.redis.zadd(key, now, now.toString());
    return true;
  }
}
```

4. Module Setup
```typescript
import { Module } from '@nestjs/common';
import { RateLimiterService } from './rate-limiter.service';
import { RedisRateLimiterService } from './redis-rate-limiter.service';
import { RateLimitGuard } from './rate-limit.guard';
import { IRateLimiterService } from './rate-limiter.interface';

@Module({
  providers: [
    {
      provide: 'RATE_LIMITER_SERVICE',
      useClass: process.env.USE_REDIS === 'true' ? RedisRateLimiterService : RateLimiterService,
    },
    RateLimitGuard,
  ],
  exports: ['RATE_LIMITER_SERVICE'],
})
export class RateLimiterModule {}
```


## Running the Project

To start the project, run the following command:
```bash
$ npm run start
```

## Testing

```bash
$ npm run test
```

## Contributing

Contributions are welcome! Please submit a pull request or open an issue to discuss any changes.

## License

This project is licensed under the MIT License.

This README provides a comprehensive guide to setting up and using the rate limiter in a NestJS project. It includes installation steps, usage examples, and details on configuring the module and services.