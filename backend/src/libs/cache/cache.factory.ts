import Keyv from 'keyv';
import config from '@config/env.config';

export function createAppCache() {
  return new Keyv({
    ttl: +config().CACHE_TTL * 1000,
  });
}
