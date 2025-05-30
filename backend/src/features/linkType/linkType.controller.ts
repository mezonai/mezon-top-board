import { Body, Controller, Delete, Get, Post, Put } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";

import { RequestWithId } from "@domain/common/dtos/request.dto";
import { Role } from "@domain/common/enum/role";

import { Public } from "@libs/decorator/authorization.decorator";
import { RoleRequired } from "@libs/decorator/roles.decorator";
import { Logger } from "@libs/logger";

import { CreateLinkTypeRequest, UpdateLinkTypeRequest } from "./dtos/request";
import { SocialLinkInMezonAppDetailResponse } from "./dtos/response";
import { LinkTypeService } from "./linkType.service";

@Controller("link-type")
@ApiTags("LinkType")
export class LinkTypeController {
  constructor(
    private readonly linkService: LinkTypeService,
    private readonly logger: Logger,
  ) {
    this.logger.setContext(LinkTypeController.name);
  }

  @Public()
  @Get()
  @ApiResponse({ type: SocialLinkInMezonAppDetailResponse })
  async getAllLinks() {
    return await this.linkService.getAllSocialLinks();
  }
  
  @ApiBearerAuth()
  @RoleRequired([Role.ADMIN])
  @Post()
  @ApiBody({ type: CreateLinkTypeRequest })
  createTag(@Body() body: CreateLinkTypeRequest) {
    try {
      return this.linkService.createLinkType(body);
    } catch (error) {
      this.logger.error("An error occured", error);
      throw error;
    }
  }

  @ApiBearerAuth()
  @RoleRequired([Role.ADMIN])
  @Put()
  @ApiBody({ type: UpdateLinkTypeRequest })
  updateTag(@Body() body: UpdateLinkTypeRequest) {
    try {
      return this.linkService.updateLinkType(body);
    } catch (error) {
      this.logger.error("An error occured", error);
      throw error;
    }
  }

  @Delete()
  @ApiBearerAuth()
  @RoleRequired([Role.ADMIN])
  async deleteLinkType(@Body() body: RequestWithId) {
    return this.linkService.deleteLinkType(body);
  }
}
