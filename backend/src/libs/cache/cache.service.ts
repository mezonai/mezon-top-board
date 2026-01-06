import { Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(private readonly cache: Cache) {}

  async get<T>(key: string): Promise<T | null> {
    return (await this.cache.get<T>(key)) ?? null;
  }

  async set<T>(key: string, value: T, ttl?: number) {
    await this.cache.set(key, value, ttl);
  }

  async del(key: string) {
    await this.cache.del(key);
  }

  async clear() {
    await this.cache.clear();
  }

  async wrap<T>(
    key: string,
    ttl: number,
    factory: () => Promise<T>,
  ): Promise<T> {
    return this.cache.wrap(key, factory, ttl);
  }
}
