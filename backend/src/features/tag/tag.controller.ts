import { Body, Controller, Delete, Get, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";

import { RequestWithId } from "@domain/common/dtos/request.dto";
import { Role } from "@domain/common/enum/role";

import { Public } from "@libs/decorator/authorization.decorator";
import { RoleRequired } from "@libs/decorator/roles.decorator";
import { Logger } from "@libs/logger";

import { CreateTagRequest, SearchTagRequest, UpdateTagRequest } from "./dtos/request";
import { TagResponse } from "./dtos/response";
import { TagService } from "./tag.service";

@Controller("tag")
@ApiTags("Tag")
export class TagController {
  constructor(
    private readonly tagService: TagService,
    private readonly logger: Logger,
  ) {
    this.logger.setContext(TagController.name);
  }

  @Public()
  @Get()
  @ApiResponse({ type: TagResponse })
  async getTags() {
    return this.tagService.getTagAll();
  }

  @Public()
  @Get("search")
  searchTag(@Query() query: SearchTagRequest) {
    try {
      return this.tagService.searchTag(query);
    } catch (error) {
      this.logger.error("An error occured", error);
      throw error;
    }
  }

  @ApiBearerAuth()
  @RoleRequired([Role.ADMIN])
  @Post()
  @ApiBody({ type: CreateTagRequest })
  createTag(@Body() body: CreateTagRequest) {
    try {
      return this.tagService.createTag(body);
    } catch (error) {
      this.logger.error("An error occured", error);
      throw error;
    }
  }

  @ApiBearerAuth()
  @RoleRequired([Role.ADMIN])
  @Put()
  @ApiBody({ type: UpdateTagRequest })
  updateTag(@Body() body: UpdateTagRequest) {
    try {
      return this.tagService.updateTag(body);
    } catch (error) {
      this.logger.error("An error occured", error);
      throw error;
    }
  } 

  @ApiBearerAuth()
  @RoleRequired([Role.ADMIN])
  @Delete()
  @ApiBody({ type: RequestWithId })
  deleteTag(@Body() body: RequestWithId) {
    try {
      return this.tagService.deleteTag(body);
    } catch (error) {
      this.logger.error("An error occured", error);
      throw error;
    }
  }
}
