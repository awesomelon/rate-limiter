import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { RateLimiterModule } from './rate-limiter.module';
import { TestController } from '../test.controller';

jest.setTimeout(15000);
describe('RateLimiterModule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [RateLimiterModule],
      controllers: [TestController],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should allow up to 5 requests per minute', async () => {
    for (let i = 0; i < 5; i++) {
      await request(app.getHttpServer()).get('/test').expect(200);
    }

    await request(app.getHttpServer()).get('/test').expect(429); // Too Many Requests
  });

  it('should reset the limit after the time window', async () => {
    await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait for 1 minute

    await request(app.getHttpServer()).get('/test').expect(200);
  });

  it('should use custom key function', async () => {
    for (let i = 0; i < 5; i++) {
      await request(app.getHttpServer())
        .get('/test')
        .set('User-Agent', `test-agent-0`)
        .expect(200);
    }

    await request(app.getHttpServer())
      .get('/test')
      .set('User-Agent', 'test-agent-0')
      .expect(429); // Too Many Requests
  });
});
