import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { App, AppVersion, Tag } from '@domain/entities';
import { AppVersionService } from './app-version.service';
import { AppTranslationModule } from '../app-translation/app-translation.module';

@Module({
  imports: [TypeOrmModule.forFeature([App, AppVersion, Tag]), AppTranslationModule],
  providers: [AppVersionService],
  exports: [AppVersionService],
})
export class AppVersionModule {}
