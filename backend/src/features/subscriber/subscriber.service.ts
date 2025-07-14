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

@Injectable()
export class SubscriberService {
  private readonly subscriberRepository: GenericRepository<Subscriber>;
  constructor(private readonly manager: EntityManager) {
    this.subscriberRepository = new GenericRepository(Subscriber, manager);
  }

  async subscribe(body: SubscribeRequest) {
    const existing = await this.subscriberRepository.getRepository().findOne({
      where: { email: ILike(body.email) },
      withDeleted: true,
    });

    if (existing) {
      if (existing.deletedAt) {
        await this.subscriberRepository.getRepository().restore(existing.id);
        return new Result({
          data: Mapper(SubscribeResponse, existing),
        });
      }
      throw new BadRequestException(ErrorMessages.EXISTED_SUBSCRIBER);
    }
    const created = await this.subscriberRepository.create({ email: body.email.trim() });

    return new Result({
      data: Mapper(SubscribeResponse, created),
    });
  }

  async unsubscribe(body: UnsubscribeRequest) {
    const existing = await this.subscriberRepository.getRepository().findOne({
      where: { email: ILike(body.email) },
    });

    if (!existing) {
      throw new BadRequestException('Email not found');
    }

    await this.subscriberRepository.softDelete(existing.id);

    return new Result({
      data: Mapper(UnsubscribeResponse, existing),
    });
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
}