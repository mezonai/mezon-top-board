import { NewsletterSchedule } from "@domain/entities/schema/campaignSchedule.entity";

import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateNewsletterSchedulRequest } from "./dtos/request";
import { IntervalUnit, ScheduleMode } from "@domain/common/enum/schedule";
import { SchedulerRegistry } from "@nestjs/schedule";
import { CronJob } from "cron";
import { NewsletterCampaignService } from "@features/newsletter-campaign/newsletter-campaign.service";
import { SortField } from "@domain/common/enum/sortField";
import { SortOrder } from "@domain/common/enum/sortOder";
import { SubscriberService } from "@features/subscriber/subscriber.service";
import { CampaignDelivery } from "@domain/entities/schema/campaignDelivery.entity";
import { MailService } from "@features/mail/mail.service";

@Injectable()
export class NewsletterScheduleService {
  private readonly logger = new Logger(NewsletterScheduleService.name);
  constructor(
    @InjectRepository(NewsletterSchedule)
    private readonly scheduleRepo: Repository<NewsletterSchedule>,

    @InjectRepository(CampaignDelivery)
    private readonly deliveryRepo: Repository<CampaignDelivery>,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly campaignService: NewsletterCampaignService,
    private readonly subscriberService: SubscriberService,
    private readonly mailService: MailService,
  ) {}

  async getSchedule(): Promise<NewsletterSchedule | null> {
    return this.scheduleRepo.findOne({ where: {} });
  }

  async updateSchedule(
    dto: CreateNewsletterSchedulRequest,
  ): Promise<NewsletterSchedule> {
    console.log(dto);
    let schedule = await this.scheduleRepo.findOne({ where: {} });

    if (!schedule) {
      schedule = this.scheduleRepo.create();
    }
    schedule.mode = dto.mode;
    schedule.fixedHours = dto.fixedHours ?? null;
    schedule.intervalValue = dto.intervalValue ?? null;
    schedule.intervalUnit = dto.intervalUnit ?? null;
    schedule.updatedAt = new Date();

    const saved = await this.scheduleRepo.save(schedule);
    this.registerJob(saved);
    return saved;
  }
  private registerJob(schedule: NewsletterSchedule) {
    try {
      this.schedulerRegistry.deleteCronJob("newsletter-job");
    } catch (e) {}

    let job: CronJob;

    if (schedule.mode === ScheduleMode.FIXED && schedule.fixedHours !== null) {
      const cronExp = `0 ${schedule.fixedHours} * * *`;
      job = new CronJob(cronExp, () => {
        this.logger.log(
          `Running newsletter job at fixed hour: ${schedule.fixedHours}`,
        );
        this.runNewsletter();
      });
    } else if (schedule.mode === ScheduleMode.INTERVAL) {
      const unit = schedule.intervalUnit;
      const val = schedule.intervalValue ?? 1;
      let cronExp: string;
      console.log(unit, val);
      switch (unit) {
        case IntervalUnit.MINUTES:
          cronExp = `*/${val} * * * *`;
          break;
        case IntervalUnit.HOURS:
          cronExp = `0 */${val} * * *`;
          break;
        case IntervalUnit.DAYS:
          cronExp = `0 0 */${val} * *`;
          break;
        default:
          throw new Error("Unsupported interval unit");
      }

      job = new CronJob(cronExp, () => {
        this.logger.log(`Running newsletter job interval ${val} ${unit}`);
        this.runNewsletter();
      });
    } else {
      this.logger.warn("No valid schedule mode");
      return;
    }

    this.schedulerRegistry.addCronJob("newsletter-job", job);
    job.start();
    this.logger.log("Newsletter job registered!");
  }

  private async runNewsletter() {
    this.logger.log(">>> Sending Newsletter <<<");

    const newsletterResult = await this.campaignService.search({
      search: undefined,
      pageSize: 100,
      pageNumber: 1,
      sortField: SortField.CREATED_AT,
      sortOrder: SortOrder.DESC,
    });

    const subscribersResult = await this.subscriberService.getAll({
      pageSize: 1000,
      pageNumber: 1,
      sortField: SortField.CREATED_AT,
      sortOrder: SortOrder.DESC,
    });

    const campaigns = Array.isArray(newsletterResult.data)
      ? newsletterResult.data
      : [newsletterResult.data];
    const subscribers = Array.isArray(subscribersResult.data)
      ? subscribersResult.data
      : [subscribersResult.data];

    for (const subscriber of subscribers) {
      const availableCampaigns = campaigns.filter(
        (c) => new Date(c.createdAt) > new Date(subscriber.createdAt),
      );

      for (const campaign of availableCampaigns) {
        const existingDelivery = await this.deliveryRepo.findOne({
          where: {
            campaign: { id: campaign.id },
            subscriber: { id: subscriber.id },
          },
        });

        if (existingDelivery?.delivered) {
          this.logger.log(
            `Already sent campaign=${campaign.title} to ${subscriber.email}, skip.`,
          );
          continue;
        }

        await this.mailService.sendGenericEmail(subscriber.email, {
          subject: campaign.title,
          template: "newsletter",
          type: "campaign",
          context: {
            headline: campaign.headline,
            desc: campaign.description,
            year: new Date().getFullYear(),
          },
        });

        if (existingDelivery) {
          existingDelivery.delivered = true;
          existingDelivery.deliveredAt = new Date();
          await this.deliveryRepo.save(existingDelivery);
        } else {
          const newDelivery = this.deliveryRepo.create({
            campaign,
            subscriber,
            delivered: true,
            deliveredAt: new Date(),
          });
          await this.deliveryRepo.save(newDelivery);
        }

        this.logger.log(
          `Sent campaign=${campaign.title} to ${subscriber.email}`,
        );
      }
    }
  }
}
