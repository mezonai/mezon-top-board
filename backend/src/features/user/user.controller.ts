import { Body, Controller, Delete, Get, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";

import { RequestWithId } from "@domain/common/dtos/request.dto";
import { User } from "@domain/entities";

import { GetUserFromHeader } from "@libs/decorator/getUserFromHeader.decorator";
import { Logger } from "@libs/logger";

import {
  GetPublicProfileInfoRequest,
  SearchUserRequest,
  SelfUpdateUserRequest,
  UpdateUserRequest,
} from "./dtos/request";
import { GetUserDetailsResponse, GetPublicProfileResponse, SearchUserResponse } from "./dtos/response";
import { UserService } from "./user.service";
import { RoleRequired } from "@libs/decorator/roles.decorator";
import { Role } from "@domain/common/enum/role";
import { Public } from "@libs/decorator/authorization.decorator";

@Controller("user")
@ApiTags("User")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: Logger,
  ) {
    this.logger.setContext(UserController.name);
  }

  @Get()
  @ApiBearerAuth()
  @RoleRequired([Role.ADMIN])
  @ApiResponse({ type: SearchUserResponse })
  async searchUser(@Query() query: SearchUserRequest) {
    return this.userService.searchUser(query);
  }

  @Get("me")
  @ApiBearerAuth()
  @ApiResponse({ type: GetUserDetailsResponse })
  async getUserDetails(@GetUserFromHeader() user: User) {
    return this.userService.getUserDetails(user.id);
  }

  @Get("public")
  @ApiBearerAuth()
  @Public()
  @ApiResponse({ type: GetPublicProfileResponse })
  async getUserPublicDetails(@Query() query: GetPublicProfileInfoRequest) {
    return this.userService.getPublicProfile(query.userId);
  }

  @Put()
  @ApiBearerAuth()
  @RoleRequired([Role.ADMIN])
  async updateUser(@Body() body: UpdateUserRequest) {
    return this.userService.updateUser(body);
  }

  @Put("self-update")
  @ApiBearerAuth()
  async selfUpdateUser(
    @GetUserFromHeader() user: User,
    @Body() body: SelfUpdateUserRequest,
  ) {
    return this.userService.seflUpdateUser(user.id, body);
  }

  @Delete()
  @ApiBearerAuth()
  @RoleRequired([Role.ADMIN])
  async deleteUser(@Body() body: RequestWithId) {
    return this.userService.deleteUser(body);
  }

  @Delete("/deactivate")
  @ApiBearerAuth()
  @RoleRequired([Role.ADMIN])
  async deactivateUser(@Body() body: RequestWithId) {
    return this.userService.deactivateUser(body);
  }

  @Post("/activate")
  @ApiBearerAuth()
  @RoleRequired([Role.ADMIN])
  async activateUser(@Body() body: RequestWithId) {
    return this.userService.activateUser(body);
  }

  @Post("/sync-mezon")
  @ApiBearerAuth()
  async markWaitingForSync(@GetUserFromHeader() user: User) {
    return this.userService.markWillSyncFromMezon(user.id);
  }
}
