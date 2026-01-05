import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags, ApiResponse } from "@nestjs/swagger";

import { User } from "@domain/entities";
import { GetUserFromHeader } from "@libs/decorator/getUserFromHeader.decorator";
import { FavoriteAppService } from "./favorite-app.service";
import { AddFavoriteAppRequest, GetFavoritesAppRequest } from "./dtos/request";

@ApiTags("Favorites")
@Controller("favorites")
@ApiBearerAuth()
export class FavoriteAppController {
    constructor(private readonly favoriteAppService: FavoriteAppService) {}

    @Get()
    @ApiResponse({ status: 200, description: "Get list of favorite bots" })
    async getFavoriteApps(
        @GetUserFromHeader() user: User,
        @Query() query: GetFavoritesAppRequest
    ) {
        return this.favoriteAppService.getMyFavoriteApps(user.id, query);
    }

    @Get(":id")
    @ApiResponse({ status: 200, description: "Get favorite bot detail" })
    async getFavoriteAppDetail(
        @GetUserFromHeader() user: User,
        @Param("id") id: string
    ) {
        return this.favoriteAppService.getFavoriteAppDetail(user.id, id);
    }

    @Post()
    @ApiResponse({ status: 201, description: "Bot added to favorites successfully" })
    async addFavoriteApp(
        @GetUserFromHeader() user: User,
        @Body() body: AddFavoriteAppRequest
    ) {
        return this.favoriteAppService.addFavoriteApp(user.id, body.id);
    }

    @Delete(":id")
    @ApiResponse({ status: 200, description: "Bot removed from favorites successfully" })
    async removeFavoriteApp(
        @GetUserFromHeader() user: User,
        @Param("id") id: string
    ) {
        return this.favoriteAppService.removeFavoriteApp(user.id, id);
    }
}