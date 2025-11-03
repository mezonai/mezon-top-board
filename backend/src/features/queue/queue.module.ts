import { Global, Module, OnModuleDestroy } from '@nestjs/common';

import * as PgBoss from 'pg-boss';

import config from "@config/env.config";

import { QueueService } from '@features/queue/queue.service';

@Global()
@Module({
  providers: [
    {
      provide: 'PG_BOSS',
      useFactory: async () => {
        const boss = new PgBoss({
          connectionString: `postgres://${config().DB_USERNAME}:${config().DB_PASSWORD}@${config().DB_HOST}:${config().DB_PORT}/${config().DB_NAME}`,
        });

        boss.on('error', (err) => console.error('PgBoss error:', err));

        await boss.start();
        return boss;
      },
    },
    QueueService,
  ],
  exports: ['PG_BOSS', QueueService],
})
export class QueueModule implements OnModuleDestroy {
  constructor() { }

  async onModuleDestroy() { }
}
