import { Body, Controller, Delete, Get, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";

import { RequestWithId } from "@domain/common/dtos/request.dto";

import { Logger } from "@libs/logger";

import { CreateMezonAppRequest, SearchMezonAppRequest, UpdateMezonAppRequest } from "./dtos/request";
import { GetMezonAppDetailsResponse, GetRelatedMezonAppResponse } from "./dtos/response";
import { MezonAppService } from "./mezon-app.service";
import { Public } from "@libs/decorator/authorization.decorator";
import { RoleRequired } from "@libs/decorator/roles.decorator";
import { Role } from "@domain/common/enum/role";
import { GetUserFromHeader } from "@libs/decorator/getUserFromHeader.decorator";
import { User } from "@domain/entities";


@Controller("mezon-app")
@ApiTags("MezonApp")
export class MezonAppController {
  constructor(
    private readonly mezonAppService: MezonAppService,
    private readonly logger: Logger,
  ) {
    this.logger.setContext(MezonAppController.name);
  }

  @Get("admin-all")
  @ApiBearerAuth()
  @RoleRequired([Role.ADMIN])
  listAdminMezonApp(@Query() query: SearchMezonAppRequest) {
    try {
      return this.mezonAppService.listAdminMezonApp(query);
    } catch (error) {
      this.logger.error("An error occured", error);
      throw error;
    }
  }

  @Get("my-app")
  @ApiBearerAuth()
  getMyApp(@GetUserFromHeader() user: User, @Query() query: SearchMezonAppRequest) {
    try {
      return this.mezonAppService.getMyApp(user.id, query);
    } catch (error) {
      this.logger.error("An error occured", error);
      throw error;
    }
  }

  @Public()
  @Get()
  @ApiResponse({ type: GetMezonAppDetailsResponse })
  getMezonAppDetail(@Query() query: RequestWithId) {
    try {
      return this.mezonAppService.getMezonAppDetail(query);
    } catch (error) {
      this.logger.error("An error occured", error);
      throw error;
    }
  }

  @Public()
  @Get("related-app")
  @ApiResponse({ type: GetRelatedMezonAppResponse, isArray: true })
  getRelatedMezonApp(@Query() query: RequestWithId) {
    try {
      return this.mezonAppService.getRelatedMezonApp(query);
    } catch (error) {
      this.logger.error("An error occured", error);
      throw error;
    }
  }

  @Public()
  @Get("search")
  searchMezonApp(@Query() query: SearchMezonAppRequest) {
    try {
      return this.mezonAppService.searchMezonApp(query);
    } catch (error) {
      this.logger.error("An error occured", error);
      throw error;
    }
  }

  @ApiBearerAuth()
  @Delete()
  @ApiBody({ type: RequestWithId })
  deleteMezonApp(@Body() body: RequestWithId) {
    try {
      return this.mezonAppService.deleteMezonApp(body);
    } catch (error) {
      this.logger.error("An error occured", error);
      throw error;
    }
  }

  @ApiBearerAuth()
  @Post()
  @ApiBody({ type: CreateMezonAppRequest })
  createMezonApp(@GetUserFromHeader() user: User, @Body() body: CreateMezonAppRequest) {
    try {
      return this.mezonAppService.createMezonApp(user.id, body);
    } catch (error) {
      this.logger.error("An error occured", error);
      throw error;
    }
  }

  @ApiBearerAuth()
  @Put()
  @ApiBody({ type: UpdateMezonAppRequest })
  updateMezonApp(@Body() body: UpdateMezonAppRequest) {
    try {
      return this.mezonAppService.updateMezonApp(body);
    } catch (error) {
      this.logger.error("An error occured", error);
      throw error;
    }
  }
}
