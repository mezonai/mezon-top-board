import { Module } from '@nestjs/common';

import { QueueModule } from '@features/queue/queue.module';

import { EmailJob } from './email.job';

@Module({
    providers: [EmailJob],
    imports: [QueueModule],
    exports: [EmailJob, QueueModule],
})
export class JobsModule { }
