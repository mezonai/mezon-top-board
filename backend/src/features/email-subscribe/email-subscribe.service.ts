import { BadGatewayException, Injectable } from '@nestjs/common';

import { Brackets, EntityManager, ObjectLiteral } from 'typeorm';

import { Result } from '@domain/common/dtos/result.dto';
import { EmailSubscriptionStatus } from '@domain/common/enum/subscribeTypes';
import { Subscriber } from '@domain/entities/schema/subscriber.entity';

import { GetEmailSubscriptionRequest, SearchEmailSubscriberRequest } from '@features/email-subscribe/dto/request';
import { SearchEmailSubscriberResponse } from '@features/email-subscribe/dto/response';
import { MailTemplateService } from '@features/marketing-mail/marketing-mail.service';

import { GenericRepository } from '@libs/repository/genericRepository';
import { Mapper } from '@libs/utils/mapper';
import { paginate } from '@libs/utils/paginate';



@Injectable()
export class EmailSubscribeService {
  private readonly subscribeRepository: GenericRepository<Subscriber>;

  constructor(
    private manager: EntityManager,
    private readonly mailService: MailTemplateService,
  ) {
    this.subscribeRepository = new GenericRepository(Subscriber, manager);
  }

  async sendMailSubcribe(email: string) {
    const exsistingSubscribe = await this.subscribeRepository.findOne({
      where: { email },
    });
    if (exsistingSubscribe) throw new BadGatewayException('Email is already subscribed');
    await this.subscribeRepository.create({ email });
    await this.mailService.sendConfirmMail(email);
    return new Result({ message: 'Please check your email to confirm subscription' });
  }

  async confirmSubscribe(email: string) {
    const subscribe = await this.subscribeRepository.findOne({
      where: {
        email,
        status: EmailSubscriptionStatus.PENDING,
      },
    });
    if (!subscribe) {
      throw new BadGatewayException('Subscription already confirmed');
    }
    await this.subscribeRepository.update(subscribe.id, {
      status: EmailSubscriptionStatus.ACTIVE,
    });
    return new Result({ message: 'Subscription confirmed successfully' });
  }

  async unsubscribe(email: string) {
    const subscribe = await this.subscribeRepository.findOne({
      where: { email, status: EmailSubscriptionStatus.ACTIVE },
    });
    if (!subscribe) throw new BadGatewayException('Invalid email or unsubscribed already');
    await this.subscribeRepository.update(subscribe.id, {
      status: EmailSubscriptionStatus.UNSUBSCRIBED,
    });
    return new Result({ message: 'Unsubscribed successfully' });
  }

  async updateSubscriptionPreferences(id: string, data: Partial<GetEmailSubscriptionRequest>) {
    const subscribe = await this.subscribeRepository.findById(id);
    if (!subscribe) throw new BadGatewayException('Subscription not found or inactive');
    await this.subscribeRepository.update(id, data);
    return new Result({ message: 'Subscription preferences updated successfully' });
  }

  async getAllSubscribers() {
    const subscribers = await this.subscribeRepository.find({});
    return new Result({ data: subscribers });
  }

  async searchSubscriber(query: SearchEmailSubscriberRequest) {
    const whereCondition = await this.buildSearchQuery(query);
    return paginate<Subscriber, SearchEmailSubscriberResponse>(
      () => whereCondition.getManyAndCount(),
      query.pageSize,
      query.pageNumber,
      (entity) => {
        const mappedMailTemplate = Mapper(SearchEmailSubscriberResponse, entity);
        return mappedMailTemplate;
      },
    );
  }

  async createSubscriber(data: GetEmailSubscriptionRequest) {
    const subscriber = this.subscribeRepository.create(data)
    return new Result({
      message: 'Subscriber created successfully.',
      data: subscriber,
    })
  }

  async deleteSubscriber(id: string) {
    const subscriber = await this.subscribeRepository.findOne({
      where: { id, status: EmailSubscriptionStatus.UNSUBSCRIBED },
    });

    if (!subscriber) throw new BadGatewayException('Subscriber not found or still active');

    await this.subscribeRepository.delete(subscriber.id);

    return new Result({ message: 'Subscriber deleted successfully' });
  }

  private async buildSearchQuery(
    query: SearchEmailSubscriberRequest,
    initialWhereCondition?: string | Brackets | ((qb: this) => string) | ObjectLiteral | ObjectLiteral[],
    initialWhereParams?: ObjectLiteral,
  ) {
    const whereCondition = this.subscribeRepository
      .getRepository()
      .createQueryBuilder("subscriber")

    if (initialWhereCondition) {
      whereCondition.where(initialWhereCondition, initialWhereParams);
    }

    // Priorize to search by keyword if field and search exist at the same time.
    if (query.search)
      whereCondition.andWhere(
        new Brackets((qb) => {
          qb.where("subscriber.email ILIKE :keyword", {
            keyword: `%${query.search}%`,
          });
        })
      );

    return whereCondition;
  }
}
