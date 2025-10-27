import { Global, Module, OnModuleDestroy } from '@nestjs/common';

import * as PgBoss from 'pg-boss';

import config from "@config/env.config";

@Global()
@Module({
  providers: [
    {
      provide: 'PG_BOSS',
      useFactory: async () => {
        const boss = new PgBoss({
          connectionString: config().DATABASE_URI
        });

        boss.on('error', (err) => console.error('PgBoss error:', err));

        await boss.start();
        return boss;
      },
    },
  ],
  exports: ['PG_BOSS'],
})
export class PgBossModule implements OnModuleDestroy {
  constructor() { }

  async onModuleDestroy() { }
}
