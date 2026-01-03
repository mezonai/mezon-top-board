import { Injectable, OnModuleInit } from '@nestjs/common';

import { MailerService } from '@nestjs-modules/mailer';

import { MarketingMailJobData } from '@features/job/job-data.types';

import { QueueService } from '../queue/queue.service';

@Injectable()
export class EmailJob implements OnModuleInit {
  private readonly queueName = 'send-email';

  constructor(
    private readonly boss: QueueService,
    private readonly mailerService: MailerService
  ) { }

  async onModuleInit() {
    await this.boss.create(this.queueName);
    await this.boss.work<MarketingMailJobData>(this.queueName, async (jobs) => {
      const jobList = Array.isArray(jobs) ? jobs : [jobs];
      for (const job of jobList) {
        await this.handleJob(job);
      }
    });
  }

  async handleJob(job) {
    const { to, subject, template, context, bcc } = job.data;

    await this.mailerService.sendMail({
      to,
      bcc,
      subject,
      template,
      context,
    });
    console.log(`sent to ${to}`);
    if (bcc?.length) console.log(`bulk sent to ${bcc.length} recipients`);
  }

  async addToQueue(data: MarketingMailJobData) {
    return await this.boss.send<MarketingMailJobData>(this.queueName, data);
  }
}
