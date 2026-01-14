import { Module, Global } from '@nestjs/common';
import { CacheService } from './cache.service';
import { createAppCache } from './cache.factory';

@Global()
@Module({
  providers: [
    {
      provide: 'APP_CACHE',
      useFactory: () => createAppCache(),
    },
    {
      provide: CacheService,
      useFactory: (cache) => new CacheService(cache),
      inject: ['APP_CACHE'],
    },
  ],
  exports: [CacheService],
})
export class CacheModule {}
