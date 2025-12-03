import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  NotFoundException,
  Req,
  Res
} from '@nestjs/common';
import { BotGeneratorService } from '@features/bot-generator/bot-generator.service';
import { GenericRepository } from '@libs/repository/genericRepository';
import { TempSourceFile } from '@domain/entities';
import { EntityManager } from 'typeorm';
import * as path from 'path';

@Controller('bot-generator')
export class BotGeneratorController {
  private readonly tempSourceFileRepository: GenericRepository<TempSourceFile>;

  constructor(
    private readonly service: BotGeneratorService,
    private readonly manager: EntityManager,
  ) {
    this.tempSourceFileRepository = new GenericRepository(TempSourceFile, manager);
  }

  @Post()
  async createJob(@Body() payload: any, @Req() req,) {
    return await this.service.createJob(payload, req.user.id);
  }

  @Get()
  async getListByOwner(@Req() req) {
    return await this.service.getListByOwner(req.user.id);
  }

  @Get(':id')
  async download(@Param('id') id: string, @Req() req, @Res() res) {
    const filePath = await this.service.getfilePathById(id, req.user.id);
    if (!filePath) throw new NotFoundException('File not found');

    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${path.basename(filePath)}"`,
    });

    return res.download(filePath);
  }
}
