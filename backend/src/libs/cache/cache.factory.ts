import { createCache, Cache } from 'cache-manager';
import Keyv from 'keyv';
import config from '@config/env.config';

export function createAppCache(): Cache {
  const memoryStore = new Keyv({
    ttl: +config().CACHE_TTL,
  });

  return createCache({
    stores: [memoryStore],
    ttl: +config().CACHE_TTL,
    cacheId: 'app-cache',
  });
}
