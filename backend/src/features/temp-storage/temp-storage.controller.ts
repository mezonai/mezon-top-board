import { Controller, Get, Param, Query } from '@nestjs/common';
import { TempStorageService } from './temp-storage.service';
import { GetOwnTempFileRequest, GetTempFileRequest } from '@features/temp-storage/dtos/request';
import { Logger } from "@libs/logger";
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleRequired } from '@libs/decorator/roles.decorator';
import { Role } from '@domain/common/enum/role';
import { GetUserFromHeader } from '@libs/decorator/getUserFromHeader.decorator';
import { User } from '@domain/entities';

@Controller('temp-storage')
@ApiTags("TempStorage")
export class TempStorageController {
  constructor(
    private readonly tempStorageService: TempStorageService,
    private readonly logger: Logger,
  ) {
    this.logger.setContext(TempStorageController.name);
  }

  @Get(":id")
  @ApiBearerAuth()
  getTempFile(@Param('id') id : string) {
    try {
      return this.tempStorageService.getTempFile(id);
    } catch (error) {
      this.logger.error("An error occured", error);
      throw error;
    }
  }

  @Get("search")
  @RoleRequired([Role.ADMIN])
  @ApiBearerAuth()
  async getTempFiles(@Query() query: GetTempFileRequest) {
    try {
      return this.tempStorageService.getListTempFiles(query);
    } catch (error) {
      this.logger.error("An error occured", error);
      throw error;
    }
  }

  @Get("my-files")
  @ApiBearerAuth()
  async getOwnTempFiles(@GetUserFromHeader() user: User, @Query() query: GetOwnTempFileRequest) {
    try {
      return this.tempStorageService.getOwnListTempFiles(user.id, query);
    } catch (error) {
      this.logger.error("An error occured", error);
      throw error;
    }
  }
}