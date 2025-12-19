import { Module } from '@nestjs/common';
import { BotGeneratorService } from './bot-generator.service';
import { BotGeneratorController } from './bot-generator.controller';
import { JobModule } from '@features/job/job.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotWizard } from '@domain/entities/schema/botWizard.entity';

@Module({
  imports: [JobModule, TypeOrmModule.forFeature([BotWizard])],
  controllers: [BotGeneratorController],
  providers: [BotGeneratorService],
  exports: [BotGeneratorService],
})
export class BotGeneratorModule {}