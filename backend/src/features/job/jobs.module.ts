import { Module } from '@nestjs/common';

import { PgBossService } from '../pg-boss/pg-boss.service';

import { EmailJob } from './email.job';

@Module({
    providers: [EmailJob, PgBossService],
})
export class JobsModule { }
