import { Inject, Injectable } from '@nestjs/common';

import PgBoss, { Job } from 'pg-boss';

import { JobData } from '@features/job/data.job';

@Injectable()
export class QueueService {
  constructor(@Inject('PG_BOSS') private readonly boss: PgBoss) { }

  async create(queue: string) {
    await this.boss.createQueue(queue);
  }

  async send<T extends object>(queue: string, data: T) {
    return this.boss.send(queue, data);
  }

  async work<T>(queue: string, handler: (jobs: Job<T>[]) => Promise<void>) {
    await this.boss.work(queue, async (jobs: Job<T>[]) => {
      if (!jobs || jobs.length === 0) return;
      try {
        await handler(jobs);
      } catch (err) {
        console.error(`[${queue}] Job failed:`, err);
        throw err;
      }
    });
  }
}
