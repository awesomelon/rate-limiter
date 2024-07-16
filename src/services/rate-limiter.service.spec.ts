import { RateLimiterService } from './rate-limiter.service';

describe('RateLimiterService', () => {
  let service: RateLimiterService;

  beforeEach(() => {
    service = new RateLimiterService();
  });

  it('should return true if limit is not exceeded', async () => {
    const key = 'test-key';
    const limit = 5;
    const timeWindow = 10000; // 1 minute

    for (let i = 0; i < limit; i++) {
      expect(await service.isAllowed(key, limit, timeWindow)).toBe(true);
    }
  });

  it('should return false if limit is exceeded', async () => {
    const key = 'test-key';
    const limit = 5;
    const timeWindow = 10000; // 1 minute

    for (let i = 0; i < limit; i++) {
      await service.isAllowed(key, limit, timeWindow);
    }

    expect(await service.isAllowed(key, limit, timeWindow)).toBe(false);
  });
});
