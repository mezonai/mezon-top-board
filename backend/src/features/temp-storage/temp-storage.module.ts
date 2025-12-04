import { Module } from '@nestjs/common';
import { TempStorageService } from './temp-storage.service';
import { TempStorageController } from './temp-storage.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TempSourceFile } from '@domain/entities';
import { CleanupService } from '@features/temp-storage/cleanStorage.service';

@Module({
  imports: [TypeOrmModule.forFeature([TempSourceFile]),],
  controllers: [TempStorageController],
  providers: [TempStorageService, CleanupService],
})
export class TempStorageModule {}
