import { Module } from '@nestjs/common';
import { TempStorageService } from './temp-storage.service';
import { TempStorageController } from './temp-storage.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
<<<<<<< HEAD
import { TempFile } from '@domain/entities';
=======
import { TempSourceFile } from '@domain/entities';
>>>>>>> cca8f2b (MTB-297-commit-remove-cleanup)

@Module({
  imports: [TypeOrmModule.forFeature([TempFile]),],
  controllers: [TempStorageController],
  providers: [TempStorageService],
<<<<<<< HEAD
  exports: [TempStorageService],
=======
>>>>>>> cca8f2b (MTB-297-commit-remove-cleanup)
})
export class TempStorageModule {}