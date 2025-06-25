import { RequestWithId } from "@domain/common/dtos/request.dto";
import { Role } from "@domain/common/enum/role";
import { User } from "@domain/entities";
import { Public } from "@libs/decorator/authorization.decorator";
import { GetUserFromHeader } from "@libs/decorator/getUserFromHeader.decorator";
import { RoleRequired } from "@libs/decorator/roles.decorator";
import { Logger } from "@libs/logger";
import { Body, Controller, Delete, Get, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";
import { CreateAppReviewRequest, GetAppReviewRequest, SearchAppReviewRequest, UpdateAppReviewRequest } from "./dtos/request";
import { ReviewHistoryService } from "./review-history.service";

@Controller("review-history")
@ApiTags("Review History")
export class ReviewHistoryController {
    constructor(
        private readonly appReviewService: ReviewHistoryService,
        private readonly logger: Logger,
    ) {
        this.logger.setContext(ReviewHistoryController.name);
    }

    
    @Get()
    @ApiBearerAuth()
    async getAppReviews(@Query() query: GetAppReviewRequest) {
        return this.appReviewService.getAppReviews(query);
    }

    
    @Get("search")
    searchMezonApp(@Query() query: SearchAppReviewRequest) {
    try {
        return this.appReviewService.searchAppReviews(query);
    } catch (error) {
        this.logger.error("An error occured", error);
        throw error;
    }
    }

    @Post()
    @ApiBearerAuth()
    @RoleRequired([Role.ADMIN])
    @ApiBody({ type: CreateAppReviewRequest })
    async createAppReview(@GetUserFromHeader() user: User, @Body() body: CreateAppReviewRequest) {
        return this.appReviewService.createAppReview(user, body);
    }

    @Put()
    @ApiBearerAuth()
    @RoleRequired([Role.ADMIN])
    @ApiBody({ type: UpdateAppReviewRequest })
    async updateAppReview(@Body() body: UpdateAppReviewRequest) {
        return this.appReviewService.updateAppReview(body);
    }

    @Delete()
    @ApiBearerAuth()
    @RoleRequired([Role.ADMIN])
    @ApiBody({ type: RequestWithId })
    async deleteAppReview(@Body() body: RequestWithId) {
        return this.appReviewService.deleteAppReview(body);
    }
}
