import { Module } from "@nestjs/common";

import { QueueModule } from "@features/queue/queue.module";

import { EmailJob } from "./email.job";
import { BotGeneratorJob } from "@features/job/bot-generator.job";
import { TempSourceFile } from "@domain/entities";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  providers: [EmailJob, BotGeneratorJob],
  imports: [QueueModule, TypeOrmModule.forFeature([TempSourceFile])],
  exports: [EmailJob, BotGeneratorJob],
})
export class JobModule { }
