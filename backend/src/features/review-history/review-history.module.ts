import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { App, AppReviewHistory, Rating, User } from "@domain/entities";

import { ReviewHistoryController } from "./review-history.controller";
import { ReviewHistoryService } from "./review-history.service";


@Module({
    imports: [TypeOrmModule.forFeature([App, User, AppReviewHistory, Rating])],
    providers: [ReviewHistoryService],
    controllers: [ReviewHistoryController],
    exports: [ReviewHistoryService],
})
export class ReviewHistoryModule { }
