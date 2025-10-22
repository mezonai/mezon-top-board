import { Processor, OnWorkerEvent, WorkerHost } from '@nestjs/bullmq';

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
    const { email, subject } = job.data;

    await this.mailerService.sendMail({
      to: email,
      subject,
      template: 'confirm-email-subscribe',
      context: {
        url: job.data.context?.url,
      }
    });
  }

  private async handleBulkSend(job: Job) {
    const { emails, subject, context } = job.data;
    for (const email of emails) {
      try {
        await this.mailerService.sendMail({
          to: email,
          subject,
          template: 'master',
          context: context,
        });
      } catch (error) {
        console.error(`Failed to send mail to ${email}:`, error.message);
      }
    }
    return { success: true, total: emails.length };
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log(`Job ${job.id} done`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error) {
    console.error(`Job ${job.id} failed:`, err.message);
  }
}
