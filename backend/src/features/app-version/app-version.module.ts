import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { App, AppVersion } from '@domain/entities';

import { AppVersionService } from './app-version.service';

@Module({
  imports: [TypeOrmModule.forFeature([App, AppVersion])],
  providers: [AppVersionService],
  exports: [AppVersionService],
})
export class AppVersionModule {}
