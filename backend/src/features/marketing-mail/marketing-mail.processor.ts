import { Processor, WorkerHost } from '@nestjs/bullmq';

import { MailerService } from '@nestjs-modules/mailer';
import { Job } from 'bullmq';

import config from "@config/env.config";

import { renderHbs } from '@libs/utils/hbs';

export interface MailJobData<T> {
  email?: string
  emails?: string[]
  subject: string;
  content?: string;
  context?: T;
}

@Processor('mail-queue')
export class MailTemplateProcessor extends WorkerHost {
  constructor(private readonly mailerService: MailerService) {
    super();
  }
  async process(job: Job) {
    switch (job.name) {
      case 'send-confirmation-mail':
        return this.handleConfirmation(job);
      case 'bulk-send-mail':
        return this.handleBulkSend(job);
      default:
        console.warn('Unknown job type:', job.name);
    }
  }

  private async handleConfirmation(job: Job) {
    const { email } = job.data;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Xác nhận đăng ký',
      template: 'master',
      context: {
        subject: 'Xác nhận đăng ký',
        content: renderHbs('confirm-email-subscribe', { url: `${config().APP_CLIENT_URL}/confirm-subscribe` }),
        year: new Date().getFullYear(),
        showUnsubscribe: false,
      }
    });
  }

  private async handleBulkSend(job: Job) {
    const { emails, subject, content } = job.data;
    await this.mailerService.sendMail({
      to: emails,
      subject,
      template: 'master',
      context: {
        subject,
        preheaderText: 'Đừng bỏ lỡ bản tin mới nhất từ Mezon Top Board',
        content,
        year: new Date().getFullYear(),
        showUnsubscribe: true,
        unsubscribeUrl: `${config().APP_CLIENT_URL}/unsubscribe`,
      },
    });
    return { success: true, total: emails.length };
  }
}
