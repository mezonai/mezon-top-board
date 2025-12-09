import { Module } from "@nestjs/common";
import { QueueModule } from "@features/queue/queue.module";
import { EmailJob } from "./email.job";
import { TempStorageModule } from "@features/temp-storage/temp-storage.module";
import { BotGeneratorJob } from "@features/job/bot-generator.job";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TempFile } from "@domain/entities";

@Module({
  providers: [EmailJob, BotGeneratorJob],
  imports: [QueueModule, TempStorageModule, TypeOrmModule.forFeature([TempFile])],
  exports: [EmailJob, BotGeneratorJob],
})
export class JobModule {}
