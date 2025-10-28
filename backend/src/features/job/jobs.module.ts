import { Module } from '@nestjs/common';

import { PgBossService } from '../queue/queue.service';

import { EmailJob } from './email.job';

@Module({
    providers: [EmailJob, PgBossService],
})
export class JobsModule { }
