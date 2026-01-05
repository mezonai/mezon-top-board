import { EmailSubscriptionStatus } from "@domain/common/enum/subscribeTypes";
import { MailTemplate } from "@domain/entities/schema/mailTemplate.entity";
import { Subscriber } from "@domain/entities/schema/subscriber.entity";
import { EmailJob } from "@features/job/email.job";
import { MarketingCampaignJobData } from "@features/job/job-data.types";
import { QueueService } from "@features/queue/queue.service";
import { GenericRepository } from "@libs/repository/genericRepository";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { EntityManager } from "typeorm";
import config from "@config/env.config";

@Injectable()
export class MarketingCampaignJob implements OnModuleInit {
  private readonly queueName = 'marketing-campaign';
  private readonly subscribeRepository: GenericRepository<Subscriber>;
  private readonly mailRepository: GenericRepository<MailTemplate>;

  constructor(
    private readonly boss: QueueService,
    private readonly emailJob: EmailJob,
    private readonly manager: EntityManager
  ) {
    this.subscribeRepository = new GenericRepository(Subscriber, manager);
    this.mailRepository = new GenericRepository(MailTemplate, manager);
  }

  async onModuleInit() {
    await this.boss.create(this.queueName);

    await this.boss.work<MarketingCampaignJobData>(
      this.queueName,
      async ([job]) => {
        await this.handle(job.data);
      }
    );
  }

  async handle({ mailTemplateId, campaignId }: MarketingCampaignJobData) {
    const mail = await this.mailRepository.findById(mailTemplateId);
    if (!mail) return;

    const subscribers = await this.subscribeRepository.find({
      where: { status: EmailSubscriptionStatus.ACTIVE },
    });

    const chunkSize = 100;

    for (let i = 0; i < subscribers.length; i += chunkSize) {
      const chunk = subscribers.slice(i, i + chunkSize);

      for (const sub of chunk) {
        await this.emailJob.addToQueue({
          to: sub.email,
          subject: mail.subject,
          template: 'marketing-mail',
          campaignId,
          context: {
            content: mail.content,
            showUnsubscribe: true,
            unsubscribeUrl: `${config().APP_CLIENT_URL}/unsubscribe`,
            year: new Date().getFullYear(),
          },
        });
      }
    }
  }
}
