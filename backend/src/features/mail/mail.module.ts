
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { BullModule } from '@nestjs/bull';
import { MailService } from './mail.service';
import { MailProcessor } from './mail.processor';
import envConfig from '@config/env.config';
const { EMAIL_HOST,EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD } = envConfig();
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: EMAIL_HOST,
        port: EMAIL_PORT,
        secure: true,
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASSWORD,
        },
      },
      defaults: {
        from: '"Mezon" <no-reply@mezon.ai>',
      },
      template: {
        dir: join(process.cwd(), 'src/features/mail/templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    BullModule.registerQueue({
      name: 'email',
    }),

  ],
  providers: [MailService, MailProcessor],
  exports: [MailService],
})
export class MailModule {}
