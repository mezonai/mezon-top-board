import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags, ApiResponse } from "@nestjs/swagger";

import { User } from "@domain/entities";
import { GetUserFromHeader } from "@libs/decorator/getUserFromHeader.decorator";
import { FavoriteService } from "./favorite.service";
import { AddFavoriteRequest, GetFavoritesRequest } from "./dtos/request";

@ApiTags("Favorites")
@Controller("favorites")
@ApiBearerAuth()
export class FavoriteController {
    constructor(private readonly favoriteService: FavoriteService) {}

    @Get()
    @ApiResponse({ status: 200, description: "Get list of favorite bots" })
    async getFavorites(
        @GetUserFromHeader() user: User,
        @Query() query: GetFavoritesRequest
    ) {
        return this.favoriteService.getMyFavorites(user.id, query);
    }

    @Get(":id")
    @ApiResponse({ status: 200, description: "Get favorite bot detail" })
    async getFavoriteDetail(
        @GetUserFromHeader() user: User,
        @Param("id") id: string
    ) {
        return this.favoriteService.getFavoriteDetail(user.id, id);
    }

    @Post()
    @ApiResponse({ status: 201, description: "Bot added to favorites successfully" })
    async addFavorite(
        @GetUserFromHeader() user: User,
        @Body() body: AddFavoriteRequest
    ) {
        return this.favoriteService.addFavorite(user.id, body.id);
    }

    @Delete(":id")
    @ApiResponse({ status: 200, description: "Bot removed from favorites successfully" })
    async removeFavorite(
        @GetUserFromHeader() user: User,
        @Param("id") id: string
    ) {
        return this.favoriteService.removeFavorite(user.id, id);
    }
}