import { Module } from '@nestjs/common';
import { TempStorageService } from './temp-storage.service';
import { TempStorageController } from './temp-storage.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TempSourceFile } from '@domain/entities';
import { CleanupService } from '@features/temp-storage/cleanup.service';

@Module({
  imports: [TypeOrmModule.forFeature([TempSourceFile]),],
  controllers: [TempStorageController],
  providers: [TempStorageService, CleanupService],
  exports: [TempStorageService],
})
export class TempStorageModule {}