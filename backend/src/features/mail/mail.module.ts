import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

import { Mail } from '@domain/entities/schema/mail.entity';
import { Subscribe } from '@domain/entities/schema/subscribe.entity';

import config from "@config/env.config";

import { MailController } from '@features/mail/mail.controller';
import { MailProcessor } from '@features/mail/mail.processor';

import { MailService } from './mail.service';

@Module({
  providers: [MailService, MailProcessor],
  imports: [
    TypeOrmModule.forFeature([Mail, Subscribe]),
    BullModule.registerQueue({
      name: 'mail-queue',
      connection: {
        host: config().REDIS_HOST,
        port: Number(config().REDIS_PORT),
        password: config().REDIS_PASSWORD,
      },
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_NAME,
          pass: process.env.EMAIL_APP_PASSWORD,
        },
      },
      defaults: {
        from: `Mezon-Top-Board`,
      },
      template: {
        dir:
          process.env.NODE_ENV === 'production'
            ? join(__dirname, 'templates')
            : join(process.cwd(), 'src/features/mail/templates'),
        adapter: new HandlebarsAdapter(),
        options: { strict: true },
      },
    }),
  ],
  controllers: [MailController],
  exports: [MailService],
})
export class MailModule {}
