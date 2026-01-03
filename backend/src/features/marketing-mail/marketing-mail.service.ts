import { BadGatewayException, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { differenceInMinutes } from 'date-fns';
import { Brackets, EntityManager, ObjectLiteral } from 'typeorm';

import { Result } from '@domain/common/dtos/result.dto';
import { EmailSubscriptionStatus, RepeatInterval } from '@domain/common/enum/subscribeTypes';
import { MailTemplate } from '@domain/entities/schema/mailTemplate.entity';
import { Subscriber } from '@domain/entities/schema/subscriber.entity';

import config from "@config/env.config";

import { EmailJob } from '@features/job/email.job';
import { CreateMailTemplateRequest, SearchMailTemplateRequest } from '@features/marketing-mail/dtos/request';
import { SearchMailTemplateResponse } from '@features/marketing-mail/dtos/response';

import { GenericRepository } from '@libs/repository/genericRepository';
import { Mapper } from '@libs/utils/mapper';
import { paginate } from '@libs/utils/paginate';

@Injectable()
export class MailTemplateService {
  private readonly subscribeRepository: GenericRepository<Subscriber>;
  private readonly mailRepository: GenericRepository<MailTemplate>;

  constructor(
    private manager: EntityManager,
    private readonly emailJob: EmailJob
  ) {
    this.subscribeRepository = new GenericRepository(Subscriber, manager);
    this.mailRepository = new GenericRepository(MailTemplate, manager);
  }

  async sendNewsletter(emails: string[], subject: string, content: string) {
    await this.emailJob.addToQueue({
      to: 'newsletter@yourdomain.com',
      bcc: emails,
      subject,
      template: 'marketing-mail',
      context: {
        content,
        showUnsubscribe: true,
        unsubscribeUrl: `${config().APP_CLIENT_URL}/unsubscribe`,
        year: new Date().getFullYear(),
      },
    });
  }

  async sendConfirmMail(email: string) {
    await this.emailJob.addToQueue({
      to: email,
      subject: 'Confirm your subscription to Mezon Top Board',
      template: 'confirm-email-subscribe',
      context: {
        url: `${config().APP_CLIENT_URL}/confirm-subscribe`,
        showUnsubscribe: false,
        year: new Date().getFullYear(),
      },
    });
  }

  async createMail(data: CreateMailTemplateRequest) {
    const mail = await this.mailRepository.create({ ...data, isRepeatable: data.isRepeatable ? data.isRepeatable : false });

    return new Result({ message: 'Mail created and newsletters are being sent', data: mail })
  }

  async getAllMails() {
    const mails = await this.mailRepository.find({});
    return new Result<MailTemplate[]>({
      data: mails,
      message: 'Mails retrieved successfully.',
    });
  }

  async getMailsSearch(query: SearchMailTemplateRequest) {
    const whereCondition = await this.buildSearchQuery(query);
    return paginate<MailTemplate, SearchMailTemplateResponse>(
      () => whereCondition.getManyAndCount(),
      query.pageSize,
      query.pageNumber,
      (entity) => {
        const mappedMailTemplate = Mapper(SearchMailTemplateResponse, entity);
        return mappedMailTemplate;
      },
    );
  }

  async getOneMail(id: string) {
    const mail = await this.mailRepository.findById(id);
    if (!mail) throw new BadGatewayException('Mail not found');
    return new Result<MailTemplate>({
      data: mail,
      message: 'Mail retrieved successfully.',
    });
  }

  async updateMail(id: string, data: Partial<CreateMailTemplateRequest>) {
    const mail = await this.mailRepository.findOne({ where: { id } });
    if (!mail) throw new BadGatewayException('Mail not found');
    await this.mailRepository.update(mail.id, data);

    return new Result<MailTemplate>({
      data: mail,
      message: 'Mail updated successfully.',
    });
  }

  async deleteMail(id: string) {
    const mail = await this.mailRepository.findOne({ where: { id } });

    if (!mail) throw new BadGatewayException('Mail not found');

    await this.mailRepository.delete(mail.id);

    return new Result({ message: 'Mail deleted successfully.' });
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async handleMailSchedule() {
    const now = new Date()

    const mails = await this.mailRepository.find({});

    const subscribers = await this.subscribeRepository.find({
      where: { status: EmailSubscriptionStatus.ACTIVE },
    })

    for (const mail of mails) {
      if (this.shouldSendNow(mail, now)) {
        const emails = subscribers.map(sub => sub.email);
        await this.sendNewsletter(emails, mail.subject, mail.content);
      }
    }
  }

  private shouldSendNow(mail: MailTemplate, now: Date): boolean {
    if (!mail.isRepeatable) {
      return (
        mail.scheduledAt.getHours() === now.getHours() &&
        mail.scheduledAt.getMinutes() === now.getMinutes() &&
        mail.scheduledAt.getDate() === now.getDate() &&
        mail.scheduledAt.getMonth() === now.getMonth() &&
        mail.scheduledAt.getFullYear() === now.getFullYear()
      );
    }

    const sameHourMinute =
      mail.scheduledAt.getHours() === now.getHours() &&
      mail.scheduledAt.getMinutes() === now.getMinutes();

    const minutesDiff = Math.abs(differenceInMinutes(now, mail.scheduledAt));
    const withinGracePeriod = minutesDiff <= 30 && sameHourMinute;

    switch (mail.repeatInterval) {
      case RepeatInterval.DAILY:
        return sameHourMinute || withinGracePeriod;

      case RepeatInterval.WEEKLY:
        return (
          now.getDay() === mail.scheduledAt.getDay() &&
          (sameHourMinute || withinGracePeriod)
        );

      case RepeatInterval.MONTHLY:
        return (
          now.getDate() === mail.scheduledAt.getDate() &&
          (sameHourMinute || withinGracePeriod)
        );

      case RepeatInterval.ANNUALLY:
        return (
          now.getMonth() === mail.scheduledAt.getMonth() &&
          now.getDate() === mail.scheduledAt.getDate() &&
          (sameHourMinute || withinGracePeriod)
        );

      default:
        return false;
    }
  }

  private async buildSearchQuery(
    query: SearchMailTemplateRequest,
    initialWhereCondition?: string | Brackets | ((qb: this) => string) | ObjectLiteral | ObjectLiteral[],
    ititialWhereParams?: ObjectLiteral,
  ) {
    const whereCondition = this.mailRepository
      .getRepository()
      .createQueryBuilder("mail_template")

    if (initialWhereCondition) {
      whereCondition.where(initialWhereCondition, ititialWhereParams);
    }

    // Priorize to search by keyword if field and search exist at the same time.
    if (query.search)
      whereCondition.andWhere(
        new Brackets((qb) => {
          qb.where("mail_template.subject ILIKE :keyword", {
            keyword: `%${query.search}%`,
          });
        })
      );

    return whereCondition;
  }
}
