import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { App, AppVersion, Tag } from '@domain/entities';

import { AppVersionService } from './app-version.service';

@Module({
  imports: [TypeOrmModule.forFeature([App, AppVersion, Tag])],
  providers: [AppVersionService],
  exports: [AppVersionService],
})
export class AppVersionModule {}
