export interface IRateLimiterService {
  getKey(request: any): string;
  isAllowed(key: string, limit: number, timeWindow: number): Promise<boolean>;
}
