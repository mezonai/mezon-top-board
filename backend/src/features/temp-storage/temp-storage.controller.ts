import { Controller, Get, Query } from '@nestjs/common';
import { TempStorageService } from './temp-storage.service';
import { GetTempSourceFileRequest } from '@features/temp-storage/dtos/request';
import { Logger } from "@libs/logger";
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RequestWithId } from '@domain/common/dtos/request.dto';

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
  @ApiBearerAuth()
  async getTempFiles(@Query() query: GetTempSourceFileRequest) {
    try {
      return this.tempStorageService.getListTempFiles(query);
    } catch (error) {
      this.logger.error("An error occured", error);
      throw error;
    }
  }
}
