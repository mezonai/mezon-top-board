import { Inject, Injectable } from '@nestjs/common';

import PgBoss, { Job } from 'pg-boss';

import { JobData } from '@features/job/data.job';

@Injectable()
export class QueueService {
  constructor(@Inject('PG_BOSS') private readonly boss: PgBoss) { }

  async create(queue: string) {
    await this.boss.createQueue(queue);
  }

  async send(queue: string, data: JobData) {
    return this.boss.send(queue, data);
  }

  async work(queue: string, handler: (job: Job<unknown>[]) => Promise<void>) {
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
