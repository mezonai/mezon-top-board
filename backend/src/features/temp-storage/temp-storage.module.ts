import { Module } from '@nestjs/common';
import { TempStorageService } from './temp-storage.service';
import { TempStorageController } from './temp-storage.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TempSourceFile } from '@domain/entities';

@Module({
  imports: [TypeOrmModule.forFeature([TempSourceFile]),],
  controllers: [TempStorageController],
  providers: [TempStorageService],
})
export class TempStorageModule {}