import { Module } from '@nestjs/common';
import { NewsletterCampaignService } from './newsletter-campaign.service';
import { NewsletterCampaignController } from './newsletter-campaign.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsletterCampaign } from '@domain/entities/schema/newsletterCampaign.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NewsletterCampaign])],
  providers: [NewsletterCampaignService],
  controllers: [NewsletterCampaignController],
  exports: [NewsletterCampaignService],
})
export class NewsletterCampaignModule {}
