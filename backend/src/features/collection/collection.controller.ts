import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { Role } from "@domain/common/enum/role";
import { User } from "@domain/entities";

import { Public } from "@libs/decorator/authorization.decorator";
import { GetUserFromHeader } from "@libs/decorator/getUserFromHeader.decorator";
import { OptionalAuth } from "@libs/decorator/optionalAuth.decorator";
import { RoleRequired } from "@libs/decorator/roles.decorator";

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
        return this.collectionService.create(user.id, dto);
    }

    @Get("my")
    @ApiBearerAuth()
    async getMyCollections(
        @GetUserFromHeader() user: User,
        @Query() query: GetMyCollectionsQueryDto
    ) {
        return this.collectionService.findMyCollections(user.id, query);
    }

    @Get("admin/search")
    @ApiBearerAuth()
    @RoleRequired([Role.ADMIN])
    async adminSearch(@Query() query: SearchCollectionsDto) {
        return this.collectionService.adminSearch(query);
    }

    @Get(":id")
    @Public()
    @OptionalAuth()
    async findOne(
        @Param("id") id: string,
        @GetUserFromHeader() user?: User
    ) {
        return this.collectionService.findOne(id, user?.id);
    }

    @Put(":id")
    @ApiBearerAuth()
    async update(
        @Param("id") id: string,
        @GetUserFromHeader() user: User,
        @Body() dto: UpdateCollectionDto
    ) {
        return this.collectionService.update(id, user.id, dto);
    }

    @Delete(":id")
    @ApiBearerAuth()
    async delete(
        @Param("id") id: string,
        @GetUserFromHeader() user: User
    ) {
        return this.collectionService.delete(id, user.id);
    }
}