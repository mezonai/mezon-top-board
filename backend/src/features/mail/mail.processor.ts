import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq'

import { MailerService } from '@nestjs-modules/mailer';
import { Job } from 'bullmq';

export interface MailJobData {
  email: string;
  subject: string;
  html?: string;
  template?: string;
  context?: Record<string, any>;
}

@Processor('mail-queue')
export class MailProcessor extends WorkerHost {
  constructor(private readonly mailerService: MailerService) {
    super();
  }

  async process(job: Job<MailJobData, void, string>): Promise<void> {
    const { email, subject, html, template, context } = job.data;

    if (template) {
      await this.mailerService.sendMail({
        to: email,
        subject,
        template,
        context,
      });
    } else {
      await this.mailerService.sendMail({
        to: email,
        subject,
        html,
      });
    }
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
