import { Test, TestingModule } from '@nestjs/testing';
import { RateLimiterService } from './rate-limiter.service';
import { ICacheService } from '../cache/cache-service.interface';

describe('RateLimiterService', () => {
  let service: RateLimiterService;
  let cacheService: ICacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RateLimiterService,
        {
          provide: 'CACHE_SERVICE',
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            clear: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RateLimiterService>(RateLimiterService);
    cacheService = module.get<ICacheService>('CACHE_SERVICE');
  });

  it('should return true if limit is not exceeded (first request)', async () => {
    const key = 'test-key';
    const limit = 5;
    const timeWindow = 60000; // 1 minute

    (cacheService.get as jest.Mock).mockResolvedValue(null);

    expect(await service.isAllowed(key, limit, timeWindow)).toBe(true);

    expect(cacheService.get).toHaveBeenCalledWith(key);
    expect(cacheService.set).toHaveBeenCalledWith(key, '1', timeWindow);
  });

  it('should return true if limit is not exceeded (subsequent requests)', async () => {
    const key = 'test-key';
    const limit = 5;
    const timeWindow = 60000; // 1 minute

    (cacheService.get as jest.Mock).mockResolvedValue('3');

    expect(await service.isAllowed(key, limit, timeWindow)).toBe(true);

    expect(cacheService.get).toHaveBeenCalledWith(key);
    expect(cacheService.set).toHaveBeenCalledWith(key, '4', timeWindow);
  });

  it('should return false if limit is exceeded', async () => {
    const key = 'test-key';
    const limit = 5;
    const timeWindow = 60000; // 1 minute

    (cacheService.get as jest.Mock).mockResolvedValue('5');

    expect(await service.isAllowed(key, limit, timeWindow)).toBe(false);

    expect(cacheService.get).toHaveBeenCalledWith(key);
    expect(cacheService.set).toHaveBeenCalledWith(key, '6', timeWindow);
  });

  it('should use the provided time window', async () => {
    const key = 'test-key';
    const limit = 5;
    const timeWindow = 30000; // 30 seconds

    (cacheService.get as jest.Mock).mockResolvedValue(null);

    await service.isAllowed(key, limit, timeWindow);

    expect(cacheService.get).toHaveBeenCalledWith(key);
    expect(cacheService.set).toHaveBeenCalledWith(key, '1', timeWindow);
  });
});
