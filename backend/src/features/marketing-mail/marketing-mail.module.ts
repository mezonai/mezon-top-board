import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailTemplate } from '@domain/entities/schema/mailTemplate.entity';
import { Subscriber } from '@domain/entities/schema/subscriber.entity';

import { JobModule } from '@features/job/job.module';
import { MailTemplateController } from '@features/marketing-mail/marketing-mail.controller';

import { MailTemplateService } from './marketing-mail.service';

@Module({
  providers: [MailTemplateService],
  imports: [
    TypeOrmModule.forFeature([MailTemplate, Subscriber]),
    JobModule,
  ],
  controllers: [MailTemplateController],
  exports: [MailTemplateService],
})
export class MailTemplateModule { }
