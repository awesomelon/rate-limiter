import { Injectable } from '@nestjs/common';
import { IRateLimiterService } from '../types';

@Injectable()
export class RateLimiterService implements IRateLimiterService {
  private store: Map<string, number[]> = new Map();

  getKey(request: any): string {
    return request.ip;
  }

  async isAllowed(
    key: string,
    limit: number,
    timeWindow: number,
  ): Promise<boolean> {
    const now = Date.now();
    if (!this.store.has(key)) {
      this.store.set(key, []);
    }

    const timestamps = this.store.get(key);
    const validTimestamps = timestamps.filter(
      (timestamp) => now - timestamp < timeWindow,
    );

    if (validTimestamps.length >= limit) {
      return false;
    }

    validTimestamps.push(now);
    this.store.set(key, validTimestamps);
    return true;
  }
}
