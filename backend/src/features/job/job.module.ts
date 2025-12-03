import { Module } from "@nestjs/common";

import { QueueModule } from "@features/queue/queue.module";

import { EmailJob } from "./email.job";
import { BotGeneratorJob } from "@features/job/bot-generator.job";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TempSourceFile } from "@domain/entities";

@Module({
  providers: [EmailJob, BotGeneratorJob],
  imports: [QueueModule, TypeOrmModule.forFeature([TempSourceFile])],
  exports: [EmailJob, BotGeneratorJob],
})
export class JobModule { }
