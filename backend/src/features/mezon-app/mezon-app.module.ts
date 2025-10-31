import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { App, AppVersion, Link, LinkType, Rating, Tag, User } from "@domain/entities";

import { AppVersionModule } from "@features/app-version/app-version.module";

import { MezonAppController } from "./mezon-app.controller";
import { MezonAppService } from "./mezon-app.service";

@Module({
  imports: [TypeOrmModule.forFeature([App, Tag, User, Rating, Link, LinkType, AppVersion]), AppVersionModule],
  providers: [MezonAppService],
  controllers: [MezonAppController],
  exports: [MezonAppService],
})
export class MezonAppModule { }
