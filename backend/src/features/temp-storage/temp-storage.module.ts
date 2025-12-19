import { Module } from '@nestjs/common';
import { TempStorageService } from './temp-storage.service';
import { TempStorageController } from './temp-storage.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TempFile } from '@domain/entities';
import { BotWizard } from '@domain/entities/schema/botWizard.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TempFile, BotWizard])],
  controllers: [TempStorageController],
  providers: [TempStorageService],
  exports: [TempStorageService],
})
export class TempStorageModule {}