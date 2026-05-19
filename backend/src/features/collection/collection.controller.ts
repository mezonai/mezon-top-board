import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query, Req,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { Request } from "express";

import { Result } from "@domain/common/dtos/result.dto";
import { User } from "@domain/entities";

import { GetUserFromHeader } from "@libs/decorator/getUserFromHeader.decorator";
import { OptionalAuth } from "@libs/decorator/optionalAuth.decorator";

import { CollectionService } from "./collection.service";
import {
    CreateCollectionDto,
    UpdateCollectionDto,
    SearchCollectionsDto,
    GetMyCollectionsQueryDto,
} from "./dtos/request";

@Controller("collection")
@ApiTags("Collection")
export class CollectionController {
    constructor(private readonly collectionService: CollectionService) {}

    @Post()
    @ApiBearerAuth()
    async create(
        @GetUserFromHeader() user: User,
        @Body() dto: CreateCollectionDto
    ) {
        const collection = await this.collectionService.create(user.id, dto);
        return new Result({ data: collection });
    }

    @Get("my-collections")
    @ApiBearerAuth()
    async getMyCollections(
        @GetUserFromHeader() user: User,
        @Query() query: GetMyCollectionsQueryDto
    ) {
        const { data, total } = await this.collectionService.findMyCollections(
            user.id,
            query
        );
        return new Result({
            data,
            pageSize: query.pageSize,
            pageNumber: query.pageNumber,
            totalCount: total,
        });
    }

    @Get("search")
    @OptionalAuth()
    async searchCollections(
        @Query() query: SearchCollectionsDto,
        @Req() req: Request & { user?: User }
    ) {
        const { data, total } = await this.collectionService.searchCollections(query, req.user?.id);
        return new Result({
            data,
            pageSize: query.pageSize,
            pageNumber: query.pageNumber,
            totalCount: total,
        });
    }

    @Get(":id")
    @OptionalAuth()
    async findOne(
        @Param("id") id: string,
        @Req() req: Request & { user?: User }
    ) {
        const userId = req.user?.id;
        const collection = await this.collectionService.findOne(id, userId);
        return new Result({ data: collection });
    }

    @Put(":id")
    @ApiBearerAuth()
    async update(
        @Param("id") id: string,
        @GetUserFromHeader() user: User,
        @Body() dto: UpdateCollectionDto
    ) {
        const collection = await this.collectionService.update(id, user, dto);
        return new Result({ data: collection });
    }

    @Delete(":id")
    @ApiBearerAuth()
    async delete(
        @Param("id") id: string,
        @GetUserFromHeader() user: User
    ) {
        await this.collectionService.delete(id, user);
        return new Result();
    }
}