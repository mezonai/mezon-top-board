import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { NewsletterCampaignService } from './newsletter-campaign.service';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { CreateNewsletterCampaignRequest, SearchNewsletterCampaignRequest, UpdateNewsletterCampaignRequest } from './dtos/request';
import { NewsletterCampaignResponse } from './dtos/response';
import { Logger } from "@libs/logger";
import { Public } from '@libs/decorator/authorization.decorator';
@Controller('newsletter-campaign')
export class NewsletterCampaignController {
    constructor(
    private readonly campaignService: NewsletterCampaignService,
    private readonly logger: Logger,
  ) {
    this.logger.setContext(NewsletterCampaignController.name);
  }

  @Post()
  @Public()
  @ApiBody({ type: CreateNewsletterCampaignRequest })
  @ApiResponse({ type: NewsletterCampaignResponse })
  async create(@Body() body: CreateNewsletterCampaignRequest) {
    try {
      return await this.campaignService.create(body);
    } catch (error) {
      this.logger.error("Create campaign failed", error);
      throw error;
    }
  }
  @Public()
  @Get('search')
  @ApiResponse({ type: NewsletterCampaignResponse, isArray: true })
  async search(@Query() query: SearchNewsletterCampaignRequest) {
    try {
      return await this.campaignService.search(query);
    } catch (error) {
      this.logger.error('Search campaign failed', error);
      throw error;
    }
  }

  @Public()
  @Put(':id')
  @ApiBody({ type: UpdateNewsletterCampaignRequest })
  @ApiResponse({ type: NewsletterCampaignResponse })
  async update(@Param('id') id: string, @Body() body: UpdateNewsletterCampaignRequest) {
    try {
      return await this.campaignService.update(id, body);
    } catch (error) {
      this.logger.error('Update campaign failed', error);
      throw error;
    }
  }

  @Public()
  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      return await this.campaignService.delete(id);
    } catch (error) {
      this.logger.error('Delete campaign failed', error);
      throw error;
    }
  }
}
