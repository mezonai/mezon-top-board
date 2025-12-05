import { Controller, Get, Query } from '@nestjs/common';
import { TempStorageService } from './temp-storage.service';
import { GetOwnTempFileRequest, GetTempFileRequest } from '@features/temp-storage/dtos/request';
import { Logger } from "@libs/logger";
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RequestWithId } from '@domain/common/dtos/request.dto';
import { RoleRequired } from '@libs/decorator/roles.decorator';
import { Role } from '@domain/common/enum/role';
import { GetUserFromHeader } from '@libs/decorator/getUserFromHeader.decorator';
import { User } from '@domain/entities';

@Controller('temp-storage')
@ApiTags("Temp Storage")
export class TempStorageController {
  constructor(
    private readonly tempStorageService: TempStorageService,
    private readonly logger: Logger,
  ) {
    this.logger.setContext(TempStorageController.name);
  }

  @Get()
  @ApiBearerAuth()
  getMedia(@Query() query: RequestWithId) {
    try {
      return this.tempStorageService.getTempFile(query);
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
