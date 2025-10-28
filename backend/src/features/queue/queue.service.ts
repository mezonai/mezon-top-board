import { Inject, Injectable } from '@nestjs/common';

import PgBoss from 'pg-boss';

@Injectable()
export class QueueService {
  constructor(@Inject('PG_BOSS') private readonly boss: PgBoss) { }

  async create(queue: string) {
    await this.boss.createQueue(queue);
  }

  async send(queue: string, data: any) {
    return this.boss.send(queue, data);
  }

  async work(queue: string, handler: (job: any) => Promise<void>) {
    await this.boss.work(queue, async (job) => {
      if (!job) return;
      try {
        await handler(job);
      } catch (err) {
        console.error(`[${queue}] Job failed:`, err);
        throw err;
      }
    });
  }
}
