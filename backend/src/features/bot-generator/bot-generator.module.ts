import { Module } from '@nestjs/common';
import { BotGeneratorService } from './bot-generator.service';
import { BotGeneratorController } from './bot-generator.controller';
import { JobModule } from '@features/job/job.module';

@Module({
  imports: [JobModule],
  controllers: [BotGeneratorController],
  providers: [BotGeneratorService],
  exports: [BotGeneratorService],
})
export class BotGeneratorModule {}