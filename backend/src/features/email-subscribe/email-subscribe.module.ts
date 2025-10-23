import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailTemplate } from '@domain/entities/schema/mailTemplate.entity';
import { Subscriber } from '@domain/entities/schema/subscriber.entity';

import { MailTemplateModule } from '@features/marketing-mail/marketing-mail.module';

import { EmailSubscribeController } from './email-subscribe.controller';
import { EmailSubscribeService } from './email-subscribe.service';

@Module({
  controllers: [EmailSubscribeController],
  providers: [EmailSubscribeService],
  imports: [
    TypeOrmModule.forFeature([Subscriber, MailTemplate]),
    MailTemplateModule
  ],
})
export class EmailSubscribeModule { }
