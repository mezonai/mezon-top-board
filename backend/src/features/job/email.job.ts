import { Injectable, OnModuleInit } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendEmailJobData } from '@features/job/job-data.types';
import { QueueService } from '../queue/queue.service';

@Injectable()
export class EmailJob implements OnModuleInit {
  private readonly queueName = 'send-email';

  constructor(
    private readonly boss: QueueService,
    private readonly mailerService: MailerService
  ) {}

  async onModuleInit() {
    await this.boss.create(this.queueName);

    await this.boss.work<SendEmailJobData>(
      this.queueName,
      async ([job]) => {
        await this.handle(job.data);
      },
    );
  }

  async handle(data: SendEmailJobData) {
    const { to, subject, template, context } = data;

    await this.mailerService.sendMail({
      to,
      subject,
      template,
      context,
    });

    console.log(`[EMAIL] Sent to ${to}`);
  }

  async addToQueue(data: SendEmailJobData) {
    return await this.boss.send(this.queueName, data, {
      retryLimit: 5,
      retryDelay: 30000,
    });
  }
}
