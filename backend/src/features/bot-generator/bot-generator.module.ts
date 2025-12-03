import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TempSourceFile } from '@domain/entities';
import { JobModule } from '@features/job/job.module';
import { BotGeneratorController } from '@features/bot-generator/bot-generator.controller';
import { BotGeneratorService } from '@features/bot-generator/bot-generator.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TempSourceFile]),
    JobModule
  ],
  controllers: [BotGeneratorController],
  providers: [BotGeneratorService],
  exports: [BotGeneratorService],
})
export class BotGeneratorModule {}