import { Module, Global } from '@nestjs/common';
import { CacheService } from './cache.service';
import { createAppCache } from './cache.factory';

@Global()
@Module({
  providers: [
    {
      provide: CacheService,
      useFactory: () => {
        const cache = createAppCache();
        return new CacheService(cache);
      },
    },
  ],
  exports: [CacheService],
})
export class CacheModule {}
