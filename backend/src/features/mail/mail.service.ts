
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import envConfig from '@config/env.config';

@Injectable()
export class MailService {
  constructor(@InjectQueue('email') private emailQueue: Queue) {}
  async sendConfirmationEmail(to: string, token: string, message = '') {
    const confirmUrl = `${envConfig().REACT_APP_FRONTEND_URL}/confirm?token=${token}`;
    console.log('Sending confirmation email to:', to);
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
