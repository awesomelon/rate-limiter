import { RedisOptions } from 'ioredis/built/redis/RedisOptions';

export interface ICacheService {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttl: number): Promise<void>;
  clear(): Promise<void>;
}

export interface ICacheOptions {
  port?: number;
  host?: string;
  redisOptions?: RedisOptions;
}
