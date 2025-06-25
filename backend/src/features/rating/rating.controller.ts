import { Body, Controller, Delete, Get, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";

import { RequestWithId } from "@domain/common/dtos/request.dto";
import { User } from "@domain/entities";

import { Public } from "@libs/decorator/authorization.decorator";
import { GetUserFromHeader } from "@libs/decorator/getUserFromHeader.decorator";
import { Logger } from "@libs/logger";

import { CreateRatingRequest, GetAllAppRatingRequest, GetAppRatingRequest, UpdateRatingRequest } from "./dtos/request";
import { GetAppRatingResponse } from "./dtos/response";
import { RatingService } from "./rating.service";

@Controller("rating")
@ApiTags("Rating")
export class RatingController {
    constructor(
        private readonly ratingService: RatingService,
        private readonly logger: Logger,
    ) {
        this.logger.setContext(RatingController.name);
    }

    @Get("get-all-by-app")
    @Public()
    @ApiResponse({ type: GetAppRatingResponse, isArray: true })
    async getAllAppRating(@Query() query: GetAllAppRatingRequest) {
        return this.ratingService.getAllAppRating(query);
    }

    @Get("get-by-app")
    @Public()
    @ApiResponse({ type: GetAppRatingResponse, isArray: true })
    async getAppRating(@Query() query: GetAppRatingRequest) {
        return this.ratingService.getAppRating(query);
    }

    @Post()
    @ApiBearerAuth()
    @ApiBody({ type: CreateRatingRequest })
    async createRating(@GetUserFromHeader() user: User, @Body() body: CreateRatingRequest) {
        return this.ratingService.createRating(user.id, body);
    }

    @Put()
    @ApiBearerAuth()
    @ApiBody({ type: UpdateRatingRequest })
    async updateRating(@GetUserFromHeader() user: User, @Body() body: UpdateRatingRequest) {
        return this.ratingService.updateRating(user.id, body);
    }

    @Delete()
    @ApiBearerAuth()
    @ApiBody({ type: RequestWithId })
    async deleteRating(@GetUserFromHeader() user: User, @Body() body: RequestWithId) {
        return this.ratingService.deleteRating(user.id, body);
    }
}
