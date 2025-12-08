import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { BotGeneratorService } from '@features/bot-generator/bot-generator.service';
import { BotWizardRequest } from '@features/bot-generator/dtos/request';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUserFromHeader } from '@libs/decorator/getUserFromHeader.decorator';
import { User } from '@domain/entities';

@Controller('bot-generator')
@ApiTags('BotGenerator')
export class BotGeneratorController {

  constructor(private readonly service: BotGeneratorService,) {}

  @Post()
  @ApiBearerAuth()
  async createJob(@Body() payload: BotWizardRequest, @GetUserFromHeader() user: User) {
    return await this.service.genBotTemplate(payload, user.id);
  }
}