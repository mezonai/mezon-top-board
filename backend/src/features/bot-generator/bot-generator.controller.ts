import {
  Controller,
  Post,
  Body,
  Req,
} from '@nestjs/common';
import { BotGeneratorService } from '@features/bot-generator/bot-generator.service';
import { BotWizardRequest } from '@features/bot-generator/dtos/request';

@Controller('bot-generator')
export class BotGeneratorController {

  constructor(private readonly service: BotGeneratorService,) { }

  @Post()
  async createJob(@Body() payload: BotWizardRequest, @Req() req,) {
    return await this.service.createJob(payload, req.user.id);
  }
}