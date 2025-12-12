import {
  Controller,
  Post,
  Body,
  Get,
  Param,
} from '@nestjs/common';
import { BotGeneratorService } from '@features/bot-generator/bot-generator.service';
import { BotWizardRequest } from '@features/bot-generator/dtos/request';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { GetUserFromHeader } from '@libs/decorator/getUserFromHeader.decorator';
import { User } from '@domain/entities';
import { OAuth2Request } from '@features/auth/dtos/request';

@Controller('bot-generator')
@ApiTags('BotGenerator')
export class BotGeneratorController {

  constructor(private readonly service: BotGeneratorService,) {}

  @Post()
  @ApiBearerAuth()
  @ApiBody({ type: OAuth2Request })
  async createJob(@Body() payload: BotWizardRequest, @GetUserFromHeader() user: User) {
    return await this.service.genBotTemplate(payload, user.id);
  }

  @Get('integrations/:language')
  @ApiBearerAuth()
  async getIntegrationsList(@Param('language') language: string) {
    return await this.service.getIntegrationsList(language);
  }
}