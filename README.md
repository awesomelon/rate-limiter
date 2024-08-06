# Nestjs-rate-limiter

This project provides a flexible and extensible rate limiter implementation for NestJS, allowing easy application of rate limits on routes using a decorator. It supports multiple storage backends and allows users to customize the key used for rate limiting.

## Features

- Easy-to-use decorator for applying rate limits on routes
- Supports multiple storage backends (Redis, in-memory, and easily extendable to others)
- Allows custom key generation functions for rate limiting
- Configurable through environment variables
- Thoroughly tested with unit and E2E tests

## Installation

To get started, install the package using npm:

```bash
npm install @j-ho/nestjs-rate-limiter
```

## Configuration

Set up environment variables to choose the storage backend. By default, it uses in-memory storage. To use Redis, set the following environment variables:

```dotenv
CACHE_TYPE=redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

## Usage

1. Import the `RateLimiterModule` in your `app.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { RateLimiterModule } from '@j-ho/nestjs-rate-limiter';

@Module({
  imports: [RateLimiterModule],
  // ...
})
export class AppModule {}
```

2. Use the `@RateLimit` decorator on your controller methods:

```typescript
import { Controller, Get } from '@nestjs/common';
import { RateLimit } from '@j-ho/nestjs-rate-limiter';

@Controller()
export class TestController {
  @Get('test')
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

## Extending the Rate Limiter

### Adding a New Cache Service

To add a new cache service:

1. Implement the `ICacheService` interface:

```typescript
import { ICacheService } from '@j-ho/nestjs-rate-limiter';

export class NewCacheService implements ICacheService {
  async get(key: string): Promise<string | null> {
    // Implementation
  }

  async set(key: string, value: string, ttl: number): Promise<void> {
    // Implementation
  }

  async clear(): Promise<void> {
    // Implementation
  }
}
```

2. Add the new service to the `CacheServiceFactory`:

```typescript
import { CacheServiceFactory } from '@j-ho/nestjs-rate-limiter';

CacheServiceFactory.prototype.create = function(type: string): ICacheService {
  switch (type) {
    case 'new-cache':
      return new NewCacheService();
    // ... other cases
  }
};
```

## Testing

To run the tests, use the following command:

```bash
npm run test
```

This will run both unit tests and E2E tests, ensuring the rate limiter functions correctly across different scenarios.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue to discuss any changes or improvements.

## License

This project is licensed under the MIT License.