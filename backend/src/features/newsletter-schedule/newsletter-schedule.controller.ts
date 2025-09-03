import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { NewsletterScheduleService } from './newsletter-schedule.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NewsletterScheduleResponse } from './dtos/respone';
import { Logger } from "@libs/logger";
import { CreateNewsletterSchedulRequest } from './dtos/request';
import { Public } from '@libs/decorator/authorization.decorator';

@Controller('newsletter-schedule')
export class NewsletterScheduleController {
    constructor(
    private readonly scheduleService: NewsletterScheduleService,
    private readonly logger: Logger,
  ) {
    this.logger.setContext(NewsletterScheduleController.name);
  }

  @Get()
  @ApiResponse({ type: NewsletterScheduleResponse })
  async getSchedule(): Promise<NewsletterScheduleResponse> {
    try {
      return await this.scheduleService.getSchedule();
    } catch (error) {
      this.logger.error("Get schedule failed", error);
      throw error;
    }
  }
  @Public()
  @Post()
  @ApiBody({ type: CreateNewsletterSchedulRequest  })
  @ApiResponse({ type: NewsletterScheduleResponse })
  async updateSchedule(
    @Body() body: CreateNewsletterSchedulRequest,
  ): Promise<NewsletterScheduleResponse> {
    try {
      return await this.scheduleService.updateSchedule(body);
    } catch (error) {
      this.logger.error("Update schedule failed", error);
      throw error;
    }
  }
}
