import { forwardRef, Module } from '@nestjs/common';
import { BotGeneratorService } from './bot-generator.service';
import { BotGeneratorController } from './bot-generator.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TempSourceFile } from '@domain/entities';
import { JobModule } from '@features/job/job.module';

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
