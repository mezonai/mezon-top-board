import { Injectable, OnModuleInit } from '@nestjs/common';

import { MailerService } from '@nestjs-modules/mailer';

import { JobData } from '@features/job/data.job';

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
    await this.boss.work(this.queueName, async (jobs) => {
      const jobList = Array.isArray(jobs) ? jobs : [jobs];
      for (const job of jobList) {
        await this.handleJob(job);
      }
    });
  }

  async handleJob(job) {
    const { to, subject, template, context } = job.data;
    if (typeof to === 'string' || (Array.isArray(to) && to.length > 0)) {
      await this.mailerService.sendMail({
        to,
        subject,
        template,
        context,
      });
      console.log(`sent to ${to}`);
    } else {
      console.log('no mail to send')
    }

  }

  async addToQueue(data: JobData) {
    return await this.boss.send(this.queueName, data);
  }
}
