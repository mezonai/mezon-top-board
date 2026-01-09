import { Injectable } from '@nestjs/common';
import Keyv from 'keyv';

@Injectable()
export class CacheService {
  constructor(private readonly cache: Keyv) {}

  async get<T>(key: string): Promise<T | null> {
    return (await this.cache.get(key)) ?? null;
  }

  async set<T>(key: string, value: T, ttl?: number) {
    await this.cache.set(key, value, ttl ? ttl * 1000 : undefined);
  }

  async del(key: string) {
    await this.cache.delete(key);
  }

  async clear() {
    await this.cache.clear();
  }

  async wrap<T>(
    key: string,
    ttl: number,
    factory: () => Promise<T>,
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) return cached;

    const value = await factory();
    await this.set(key, value, ttl);
    return value;
  }
}
