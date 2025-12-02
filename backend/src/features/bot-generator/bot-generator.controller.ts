import {
  Controller,
  Post,
  Body,
  Res,
} from '@nestjs/common';
import { BotGeneratorService } from './bot-generator.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '@libs/decorator/authorization.decorator';
import { FastifyReply } from 'fastify';

@Controller('bot-generator')
@ApiTags("Bot-Generator")
export class BotGeneratorController {
  constructor(private readonly botGeneratorService: BotGeneratorService) {}

  @Public()
  @Post('generate')
  async generateProject(@Body() payload, @Res() reply: FastifyReply) {
    const zipBuffer = await this.botGeneratorService.generateBotProject(payload);

    reply
      .header('Content-Type', 'application/zip')
      .header('Content-Disposition', 'attachment; filename="mezon-bot.zip"')
      .send(zipBuffer);
  }
}
