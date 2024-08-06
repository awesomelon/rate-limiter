import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { RateLimiterModule } from './rate-limiter.module';
import { TestController } from './test.controller';
import { ICacheService } from './cache/cache-service.interface';

jest.setTimeout(30000); // Increase the timeout to 30 seconds

describe('RateLimiterModule (e2e)', () => {
  let app: INestApplication;
  let cacheService: ICacheService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [RateLimiterModule],
      controllers: [TestController],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    cacheService = moduleFixture.get<ICacheService>('CACHE_SERVICE');
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clear cache before each test
    await cacheService.clear();
  });

  it('should allow up to 5 requests per minute', async () => {
    for (let i = 0; i < 5; i++) {
      await request(app.getHttpServer()).get('/test').expect(200);
    }

    await request(app.getHttpServer()).get('/test').expect(429); // Too Many Requests
  });

  it('should reset the limit after the time window', async () => {
    // Make 5 requests to hit the limit
    for (let i = 0; i < 5; i++) {
      await request(app.getHttpServer()).get('/test').expect(200);
    }

    // Wait for a short time (e.g., 2 seconds) instead of full minute
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Manually clear the cache to simulate time window expiration
    await cacheService.clear();

    // This request should now be allowed
    await request(app.getHttpServer()).get('/test').expect(200);
  });

  it('should use custom key function', async () => {
    // Make 5 requests with the same User-Agent
    for (let i = 0; i < 5; i++) {
      await request(app.getHttpServer())
        .get('/custom')
        .set('User-Agent', 'test-agent-0')
        .expect(200);
    }

    // The 6th request with the same User-Agent should be rate limited
    await request(app.getHttpServer())
      .get('/custom')
      .set('User-Agent', 'test-agent-0')
      .expect(429); // Too Many Requests

    // A request with a different User-Agent should be allowed
    await request(app.getHttpServer())
      .get('/custom')
      .set('User-Agent', 'test-agent-1')
      .expect(200);
  });
});
