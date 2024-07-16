export interface IRateLimiterService {
  getKey(request: any): string;
  isAllowed(key: string, limit: number, timeWindow: number): Promise<boolean>;
}

export const RATE_LIMITER_SERVICE = 'RATE_LIMITER_SERVICE';

export const META_DATA_KEY = 'rateLimit';
