import { EmailSubscriptionStatus } from "@domain/common/enum/subscribeTypes";
import { Subscriber } from "@domain/entities/schema/subscriber.entity";
import { EmailJob } from "@features/job/email.job";
import { MarketingCampaignJobData } from "@features/job/job-data.types";
import { QueueService } from "@features/queue/queue.service";
import { GenericRepository } from "@libs/repository/genericRepository";
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { EntityManager } from "typeorm";
import config from "@config/env.config";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from 'cache-manager';
import envConfig from "@config/env.config";
import { ACTIVE_SUBSCRIBERS_CACHE_KEY } from "@domain/common/constants/cache";

@Injectable()
export class MarketingCampaignJob implements OnModuleInit {
  private readonly queueName = 'marketing-campaign';
  private readonly subscribeRepository: GenericRepository<Subscriber>;

  constructor(
    private readonly boss: QueueService,
    private readonly emailJob: EmailJob,
    private readonly manager: EntityManager,
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
  ) {
    this.subscribeRepository = new GenericRepository(Subscriber, manager);
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

  async handle({ mailTemplate }: MarketingCampaignJobData) {
    let subscribers = await this.cache.get<{ email: string }[]>(
      ACTIVE_SUBSCRIBERS_CACHE_KEY,
    );

    if (!subscribers) {
      subscribers = await this.subscribeRepository.find({
        where: { status: EmailSubscriptionStatus.ACTIVE },
      });

      await this.cache.set(
        ACTIVE_SUBSCRIBERS_CACHE_KEY,
        subscribers,
        envConfig().CACHE_TTL,
      );
    }

    await Promise.all(
      subscribers.map(sub =>
        this.emailJob.addToQueue({
          to: sub.email,
          subject: mailTemplate.subject,
          template: 'marketing-mail',
          context: {
            content: mailTemplate.content,
            showUnsubscribe: true,
            unsubscribeUrl: `${config().APP_CLIENT_URL}/unsubscribe`,
            year: new Date().getFullYear(),
          },
        })
      )
    );
  }
}
