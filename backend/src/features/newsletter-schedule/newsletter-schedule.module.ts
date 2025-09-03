import { Module } from "@nestjs/common";
import { NewsletterScheduleController } from "./newsletter-schedule.controller";
import { NewsletterScheduleService } from "./newsletter-schedule.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NewsletterSchedule } from "@domain/entities/schema/campaignSchedule.entity";
import { NewsletterCampaignModule } from "@features/newsletter-campaign/newsletter-campaign.module";
import { SubscriberModule } from "@features/subscriber/subscriber.module";
import { CampaignDelivery } from "@domain/entities/schema/campaignDelivery.entity";
import { MailModule } from "@features/mail/mail.module";

@Module({
  imports: [TypeOrmModule.forFeature([NewsletterSchedule, CampaignDelivery]),NewsletterCampaignModule, SubscriberModule,MailModule],
  providers: [NewsletterScheduleService],
  controllers: [NewsletterScheduleController],
  exports: [NewsletterScheduleService],
})
export class NewsletterScheduleModule {}
