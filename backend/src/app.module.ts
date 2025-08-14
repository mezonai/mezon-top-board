import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { dataSourceOption } from "@config/data-source.config";
import config, { envFilePath } from "@config/env.config";

import { AuthModule } from "@features/auth/auth.module";
import { LinkTypeModule } from "@features/linkType/linkType.module";
import { MediaModule } from "@features/media/media.module";
import { MezonAppModule } from "@features/mezon-app/mezon-app.module";
import { RatingModule } from "@features/rating/rating.module";
import { ReviewHistoryModule } from "@features/review-history/review-history.module";
import { TagModule } from "@features/tag/tag.module";
import { UserModule } from "@features/user/user.module";

import { GuardModule } from "@libs/guard/guard.module";
import { LoggerModule } from "@libs/logger";

import { SubscriberModule } from './features/subscriber/subscriber.module';
import { BullModule } from "@nestjs/bull";
import { redisConfig } from './config/mail.config';
import { NewsletterCampaignModule } from './features/newsletter-campaign/newsletter-campaign.module';
import { NewsletterCampaignController } from './features/newsletter-campaign/newsletter-campaign.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
      envFilePath: envFilePath,
    }),
    BullModule.forRoot({
     redis:redisConfig
    }),
    TypeOrmModule.forRoot(dataSourceOption),
    LoggerModule,
    MediaModule,
    MezonAppModule,
    AuthModule,
    GuardModule,
    TagModule,
    ReviewHistoryModule,
    UserModule,
    LinkTypeModule,
    RatingModule,
    SubscriberModule,
    NewsletterCampaignModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
