import { Processor, WorkerHost } from '@nestjs/bullmq';

import { MailerService } from '@nestjs-modules/mailer';
import { Job } from 'bullmq';


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
    const { email, subject, context } = job.data;
    await this.mailerService.sendMail({
      to: email,
      subject,
      template: 'master',
      context
    });
  }

  private async handleBulkSend(job: Job) {
    const { emails, subject, context } = job.data;
    await this.mailerService.sendMail({
      to: emails,
      subject,
      template: 'master',
      context: context,
    });
    return { success: true, total: emails.length };
  }
}
