import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { join } from "path";

import { dataSourceOption } from "@config/data-source.config";
import config, { envFilePath } from "@config/env.config";

import { AppVersionModule } from '@features/app-version/app-version.module';
import { AuthModule } from "@features/auth/auth.module";
import { EmailSubscribeModule } from "@features/email-subscribe/email-subscribe.module";
import { JobModule } from "@features/job/job.module";
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
import { NezonModule } from "@n0xgg04/nezon";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
      envFilePath: envFilePath,
    }),
    NezonModule.forRoot({
      token: config().MEZON_TOKEN,
      botId: config().MEZON_BOT_ID,
    }),
    TypeOrmModule.forRoot(dataSourceOption),
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
        dir: join(process.cwd(), "dist", "templates"),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
          extName: ".hbs",
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
    EmailSubscribeModule,
    MailTemplateModule,
    JobModule,
    AppVersionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
