import { Module } from "@nestjs/common";

import { QueueModule } from "@features/queue/queue.module";

import { EmailJob } from "./email.job";
import { BotGeneratorJob } from "@features/job/bot-generator.job";
import { TempStorageModule } from "@features/temp-storage/temp-storage.module";

@Module({
  providers: [EmailJob, BotGeneratorJob],
  imports: [QueueModule, TempStorageModule],
  exports: [EmailJob, BotGeneratorJob],
})
export class JobModule {}
