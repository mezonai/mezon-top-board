import { Module } from '@nestjs/common';
import { BotGeneratorService } from './bot-generator.service';
import { BotGeneratorController } from './bot-generator.controller';

@Module({
  controllers: [BotGeneratorController],
  providers: [BotGeneratorService],
  exports: [BotGeneratorService],
})
export class BotGeneratorModule {}
