import { Injectable } from '@nestjs/common';
import { ICacheService } from './cache-service.interface';

@Injectable()
export class InMemoryCacheService implements ICacheService {
  private store: Map<string, { value: string; expiry: number }> = new Map();

  async get(key: string): Promise<string | null> {
    const item = this.store.get(key);
    if (!item) return null;
    if (item.expiry < Date.now()) {
      this.store.delete(key);
      return null;
    }
    return item.value;
  }

  async set(key: string, value: string, ttl: number): Promise<void> {
    this.store.set(key, { value, expiry: Date.now() + ttl });
  }

  async clear(): Promise<void> {
    this.store.clear();
  }
}
