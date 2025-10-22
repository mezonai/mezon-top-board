import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailTemplate } from '@domain/entities/schema/mailTemplate.entity';
import { Subscriber } from '@domain/entities/schema/subscriber.entity';

import { MailTemplateController } from '@features/marketing-mail/marketing-mail.controller';
import { MailTemplateProcessor } from '@features/marketing-mail/marketing-mail.processor';

import { MailTemplateService } from './marketing-mail.service';


@Module({
  providers: [MailTemplateService, MailTemplateProcessor],
  imports: [
    TypeOrmModule.forFeature([MailTemplate, Subscriber]),
    BullModule.registerQueue({
      name: 'mail-queue',
    }),
  ],
  controllers: [MailTemplateController],
  exports: [MailTemplateService],
})
export class MailTemplateModule { }
