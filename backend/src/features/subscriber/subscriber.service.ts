import { Subscriber } from '@domain/entities/schema/subscriber.entity';
import { GenericRepository } from '@libs/repository/genericRepository';
import { BadRequestException, Injectable } from '@nestjs/common';

import { EntityManager, ILike } from 'typeorm';
import { SearchSubscriberRequest, SubscribeRequest, UnsubscribeRequest } from './dtos/request';
import { SubscribeResponse, SubscriberResponse, UnsubscribeResponse } from './dtos/response';
import { Result } from '@domain/common/dtos/result.dto';
import { Mapper } from '@libs/utils/mapper';
import { searchBuilder } from '@libs/utils/queryBuilder';
import { paginate } from '@libs/utils/paginate';
import { ErrorMessages } from '@libs/constant/messages';
import { randomUUID } from 'crypto';
import { MailService } from '@features/mail/mail.service';
import * as moment from "moment";

@Injectable()
export class SubscriberService {
  private readonly subscriberRepository: GenericRepository<Subscriber>;
  constructor(
    private readonly manager: EntityManager,
    private readonly mailService: MailService,
  ) {
    this.subscriberRepository = new GenericRepository(Subscriber, manager);
  }

  async subscribe(body: SubscribeRequest) {
    const email = body.email.trim().toLowerCase();
    const existing = await this.subscriberRepository.getRepository().findOne({
      where: { email: ILike(email) },
      withDeleted: true,
    });

    const now = moment();
    console.log('Current time:', now);
    const SEVEN_DAYS = 7;

    if (!existing) {
      const confirmToken = randomUUID();
      const created = await this.subscriberRepository.create({
        email,
        confirmToken,
        isConfirmed: false,
        subscribedAt: now.toDate(),
      });
      await this.mailService.sendConfirmationEmail(email, confirmToken);
      return new Result({
        data: Mapper(SubscribeResponse, created),
        message: 'Confirmation email sent.',
      });
    }
    if (existing.deletedAt) {
      await this.subscriberRepository.getRepository().restore(existing.id);
      return new Result({
        data: Mapper(SubscribeResponse, existing),
        message: 'Email restored and already subscribed.',
      });
    }

      const createdAt = moment(existing.subscribedAt);
      const isOverdue = now.diff(createdAt, 'days') > SEVEN_DAYS;

      if (!existing.isConfirmed && isOverdue) {
        const confirmToken = randomUUID();
        const message = 'Confirmation email re-sent.';
        existing.confirmToken = confirmToken;
        existing.subscribedAt = now.toDate(); 
        await this.subscriberRepository.update(existing.id, existing);
        await this.mailService.sendConfirmationEmail(email, confirmToken,message);
        return new Result({
          data: Mapper(SubscribeResponse, existing),
          message: message,
        });
      }
      throw new BadRequestException(ErrorMessages.EXISTED_SUBSCRIBER);

  }

  async getAll(query: SearchSubscriberRequest) {
    let whereCondition = undefined;
    if (query.search) {
      whereCondition = searchBuilder<Subscriber>({
        keyword: query.search,
        fields: ['email'],
      });
    }

    const result = await paginate<Subscriber, SubscriberResponse>(
      () =>
        this.subscriberRepository.findMany({
          ...query,
          where: () => whereCondition,
        }),
      query.pageSize,
      query.pageNumber,
    (entity) => Mapper(SubscriberResponse, entity),
    );

    if (!Array.isArray(result.data) || result.data.length === 0) {
      throw new BadRequestException(ErrorMessages.NOT_FOUND_SUBSCRIBER);
    }
    return result;
  }

  async confirmEmail(token: string): Promise<Result<SubscribeResponse>> {
    const subscriber = await this.subscriberRepository.getRepository().findOne({
      where: { confirmToken: token },
    });

    if (!subscriber) {
      throw new BadRequestException('Invalid or expired confirmation token');
    }

    if (subscriber.isConfirmed) {
      return new Result({
        data: Mapper(SubscribeResponse, subscriber),
        message: 'Email already confirmed',
      });
    }

    subscriber.isConfirmed = true;
    subscriber.confirmToken = null;
    await this.subscriberRepository.update(subscriber.id, subscriber);

    return new Result({
      data: Mapper(SubscribeResponse, subscriber),
      message: 'Email confirmed successfully',
    });
  }
}