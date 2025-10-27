import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { join } from "path";

import { dataSourceOption } from "@config/data-source.config";
import config, { envFilePath } from "@config/env.config";

import { AuthModule } from "@features/auth/auth.module";
import { EmailSubscribeModule } from "@features/email-subscribe/email-subscribe.module";
import { LinkTypeModule } from "@features/linkType/linkType.module";
import { MailTemplateModule } from "@features/marketing-mail/marketing-mail.module";
import { MediaModule } from "@features/media/media.module";
import { MezonAppModule } from "@features/mezon-app/mezon-app.module";
import { RatingModule } from "@features/rating/rating.module";
import { ReviewHistoryModule } from "@features/review-history/review-history.module";
import { TagModule } from "@features/tag/tag.module";
import { UserModule } from "@features/user/user.module";

import { GuardModule } from "@libs/guard/guard.module";
import { LoggerModule } from "@libs/logger";


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
      envFilePath: envFilePath,
    }),
    TypeOrmModule.forRoot(dataSourceOption),
    // BullModule.forRoot({
    //   connection: {
    //     host: config().REDIS_HOST,
    //     port: Number(config().REDIS_PORT),
    //     password: config().REDIS_PASSWORD,
    //   },
    // }),
    MailerModule.forRoot({
      transport: {
        host: config().SMTP_HOST,
        port: config().SMTP_PORT,
        secure: false,
        auth: {
          user: config().SMTP_EMAIL,
          pass: config().SMTP_PASSWORD,
        },
      },
      defaults: {
        from: `Mezon-Top-Board`,
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
          extName: '.hbs',
        },
      },
    }),
    ScheduleModule.forRoot(),
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
    //EmailSubscribeModule,
    //MailTemplateModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
