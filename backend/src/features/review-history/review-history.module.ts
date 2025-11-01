import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { App, AppReviewHistory, AppVersion, Rating, User } from "@domain/entities";

import { AppVersionModule } from "@features/app-version/app-version.module";

import { ReviewHistoryController } from "./review-history.controller";
import { ReviewHistoryService } from "./review-history.service";


@Module({
    imports: [TypeOrmModule.forFeature([App, User, AppReviewHistory, Rating, AppVersion]), AppVersionModule],
    providers: [ReviewHistoryService],
    controllers: [ReviewHistoryController],
    exports: [ReviewHistoryService],
})
export class ReviewHistoryModule { }
