import { Injectable } from '@nestjs/common';
import { RateLimitStore } from './rate-limit.store';

@Injectable()
export class RateLimitService {
  limit = 10;
  constructor(private store: RateLimitStore) {}

  async checkRateLimit(
    key: string,
  ): Promise<{ success: boolean; current: number }> {
    const current = await this.store.increment(key);
    const limit = this.limit;
    const success = current <= limit;

    return { success, current };
  }
}
