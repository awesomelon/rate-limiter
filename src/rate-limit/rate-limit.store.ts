import { Injectable } from '@nestjs/common';

@Injectable()
export class RateLimitStore {
  private store: Map<string, { count: number; timestamp: number }> = new Map();

  async increment(key: string): Promise<number> {
    const now = Date.now();
    const windowMs = 15 * 60 * 1000;

    if (!this.store.has(key)) {
      this.store.set(key, { count: 1, timestamp: now });
      return 1;
    }

    const record = this.store.get(key);
    if (now - record.timestamp > windowMs) {
      record.count = 1;
      record.timestamp = now;
    } else {
      record.count++;
    }

    return record.count;
  }

  async resetKey(key: string): Promise<void> {
    this.store.delete(key);
  }
}
