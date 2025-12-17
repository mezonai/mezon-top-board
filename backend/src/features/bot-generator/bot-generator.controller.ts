import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { BotGeneratorService } from '@features/bot-generator/bot-generator.service';
import { BotWizardRequest, GetOwnBotWizardRequest } from '@features/bot-generator/dtos/request';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { GetUserFromHeader } from '@libs/decorator/getUserFromHeader.decorator';
import { User } from '@domain/entities';

@Controller('bot-generator')
@ApiTags('BotGenerator')
@ApiBearerAuth()
export class BotGeneratorController {
  constructor(private readonly service: BotGeneratorService) {}

  @Post()
  @ApiBearerAuth()
  @ApiBody({ type: BotWizardRequest })
  async createJob(@Body() payload: BotWizardRequest, @GetUserFromHeader() user: User) {
    return await this.service.genBotTemplate(payload, user.id);
  }

  @Get('integrations/:language')
  @ApiBearerAuth()
  async getIntegrationsList(@Param('language') language: string) {
    return await this.service.getIntegrationsList(language);
  }

  @Get('languages')
  @ApiBearerAuth()
  async getLanguagesList() {
    return await this.service.getLanguagesList();
  }

  @Get('my-wizards')
  @ApiBearerAuth()
  async getOwnListBotWizards(
    @GetUserFromHeader() user: User,
    @Query() query: GetOwnBotWizardRequest,
  ) {
    return await this.service.getOwnListbotWizards(user.id, query);
  }

  @Get(':id')
  @ApiBearerAuth()
  async getBotWizard(@Param('id') id: string) {
    return await this.service.getBotWizard(id);
  }
}
