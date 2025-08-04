
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import envConfig from '@config/env.config';
import { buildAppUrl } from '@libs/utils/urlBuilder';

@Injectable()
export class MailService {
  constructor(@InjectQueue('email') private emailQueue: Queue) {}
  async sendConfirmationEmail(to: string, token: string, message = '') {
    const confirmUrl = buildAppUrl('/confirm', { token });
    await this.emailQueue.add('sendConfirmEmail', {
      to,
      subject: 'Please confirm your email',
      template: 'confirm',
      context: {
        confirmUrl,
        to,
        message,
      },
    });
  }
}
