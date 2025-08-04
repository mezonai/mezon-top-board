
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MailService } from './mail.service';
import { MailProcessor } from './mail.processor';
import { mailConfig } from '@config/mail.config';
@Module({
  imports: [
    MailerModule.forRoot(mailConfig),
    BullModule.registerQueue({
      name: 'email',
    }),

  ],
  providers: [MailService, MailProcessor],
  exports: [MailService],
})
export class MailModule {}
