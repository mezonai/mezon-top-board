import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";

import { RequestWithId } from "@domain/common/dtos/request.dto";
import { Role } from "@domain/common/enum/role";
import { User } from "@domain/entities";

import { AppVersionService } from "@features/app-version/app-version.service";
import { CreateAppVersionRequest } from "@features/app-version/dtos/request";

import { Public } from "@libs/decorator/authorization.decorator";
import { GetUserFromHeader } from "@libs/decorator/getUserFromHeader.decorator";
import { RoleRequired } from "@libs/decorator/roles.decorator";
import { Logger } from "@libs/logger";

import {
  CreateMezonAppRequest,
  SearchMezonAppRequest,
  UpdateMezonAppRequest,
} from "./dtos/request";
import {
  GetMezonAppDetailsResponse,
  GetRelatedMezonAppResponse,
} from "./dtos/response";
import { MezonAppService } from "./mezon-app.service";




@Controller("mezon-app")
@ApiTags("MezonApp")
export class MezonAppController {
  constructor(
    private readonly mezonAppService: MezonAppService,
    private readonly appVersionService: AppVersionService,
    private readonly logger: Logger,
  ) {
    this.logger.setContext(MezonAppController.name);
  }

  @Post("version")
  async createVersion(
    @Body() data: CreateAppVersionRequest,
  ) {
    return await this.appVersionService.createVersion(data);
  }

  @Get('version/:appId')
  async getVersionsByApp(@Param('appId') appId: string) {
    return await this.appVersionService.getVersionsByApp(appId);
  }

  @Post('version/approve/:versionId')
  async approveVersion(
    @Param('versionId') versionId: string,
    @Req() req: any,
  ) {
    const approverId = req.user?.id ?? 'system';
    return await this.appVersionService.approveVersion(versionId, approverId);
  }

  @Post('version/reject/:versionId')
  async rejectVersion(
    @Param('versionId') versionId: string,
    @Query('remark') remark?: string,
  ) {
    return await this.appVersionService.rejectVersion(versionId, remark);
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
  getMyApp(
    @GetUserFromHeader() user: User,
    @Query() query: SearchMezonAppRequest,
  ) {
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
  deleteMezonApp(
    @GetUserFromHeader() user: User,
    @Body() body: RequestWithId
  ) {
    try {
      return this.mezonAppService.deleteMezonApp(user, body);
    } catch (error) {
      this.logger.error("An error occured", error);
      throw error;
    }
  }

  @ApiBearerAuth()
  @Post()
  @ApiBody({ type: CreateMezonAppRequest })
  createMezonApp(
    @GetUserFromHeader() user: User,
    @Body() body: CreateMezonAppRequest,
  ) {
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
  updateMezonApp(
    @GetUserFromHeader() user: User,
    @Body() body: UpdateMezonAppRequest
  ) {
    try {
      return this.mezonAppService.updateMezonApp(user, body);
    } catch (error) {
      this.logger.error("An error occured", error);
      throw error;
    }
  }
}
