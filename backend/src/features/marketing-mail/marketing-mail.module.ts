import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';


import { MailTemplate } from '@domain/entities/schema/mailTemplate.entity';
import { Subscriber } from '@domain/entities/schema/subscriber.entity';

import { EmailJob } from '@features/job/email.job';
import { MailTemplateController } from '@features/marketing-mail/marketing-mail.controller';
import { PgBossService } from '@features/pg-boss/pg-boss.service';

import { MailTemplateService } from './marketing-mail.service';

@Module({
  providers: [MailTemplateService, EmailJob, PgBossService],
  imports: [
    TypeOrmModule.forFeature([MailTemplate, Subscriber]),
  ],
  controllers: [MailTemplateController],
  exports: [MailTemplateService],
})
export class MailTemplateModule { }
