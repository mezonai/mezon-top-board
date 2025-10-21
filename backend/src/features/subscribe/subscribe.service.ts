import { BadGatewayException, Injectable } from '@nestjs/common';

import * as crypto from 'crypto'
import { Response } from 'express';
import { EntityManager } from 'typeorm';

import { Result } from '@domain/common/dtos/result.dto';
import { SubscriptionStatus } from '@domain/common/enum/subscribeTypes';
import { Mail } from '@domain/entities/schema/mail.entity';
import { Subscribe } from '@domain/entities/schema/subscribe.entity';

import config from "@config/env.config";

import { MailService } from '@features/mail/mail.service';
import { GetSubscriptionRequest } from '@features/subscribe/dto/request';

import { GenericRepository } from '@libs/repository/genericRepository';


@Injectable()
export class SubscribeService {
  private readonly subscribeRepository: GenericRepository<Subscribe>;
  private readonly mailRepository: GenericRepository<Mail>;

  constructor(
    private manager: EntityManager,
    private readonly mailService: MailService,
  ) {
    this.subscribeRepository = new GenericRepository(Subscribe, manager);
    this.mailRepository = new GenericRepository(Mail, manager);
  }

  async sendMailSubcribe(email: string) {
    const exsistingSubscribe = await this.subscribeRepository.findOne({
      where: { email },
    });
    if (exsistingSubscribe) throw new BadGatewayException('Email is already subscribed');
    const token = crypto.randomBytes(32).toString('hex');
    const confirmationToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    const confirmationTokenExpires = new Date(Date.now() + 15 * 60 * 1000);
    await this.subscribeRepository.create({
      email,
      confirmationToken,
      confirmationTokenExpires,
      subscribedAt: null,
    });
    await this.mailService.sendConfirmMail(email, token);
    return new Result({message: 'Please check your email to confirm subscription' });
  }

  async confirmSubscribe(token: string, res: Response) {
    const confirmationToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    const subscribe = await this.subscribeRepository.findOne({
      where: {
        confirmationToken,
        status: SubscriptionStatus.PENDING,
      },
    });

    if (!subscribe) {
      return res.redirect(
        `${config().URL_CLIENT}/confirm-subscribe/failed?message=Invalid token`,
      );
    }
    if (subscribe.confirmationTokenExpires < new Date()) {
      await this.subscribeRepository.delete(subscribe.id);
      return res.redirect(
        `${config().URL_CLIENT}/confirm-subscribe/failed?message=Token has expired, please subscribe again`,
      );
    }
    await this.subscribeRepository.update(subscribe.id, {
      status: SubscriptionStatus.ACTIVE,
      confirmationToken: null,
      confirmationTokenExpires: null,
      subscribedAt: new Date(),
    });
    return res.redirect(
        `${config().URL_CLIENT}/confirm-subscribe/success?message=Subscription confirmed successfully`,
    );
  }

  async unsubscribe(email: string, res: Response) {
    const subscribe = await this.subscribeRepository.findOne({
      where: { email, status: SubscriptionStatus.ACTIVE },
    });
    if (!subscribe) return res.redirect(
        `${config().URL_CLIENT}/unsubscribe/failed?message=Invalid email or unsubscribed already`,
      );
    await this.subscribeRepository.update(subscribe.id, {
      status: SubscriptionStatus.UNSUBSCRIBED,
      unsubscribedAt: new Date(),
    });
    return res.redirect(
        `${config().URL_CLIENT}/unsubscribe/success?message=Unsubscribed successfully`,
      );
  }

  async updateSubscriptionPreferences(id: string, data: Partial<GetSubscriptionRequest>) {
    const subscribe = await this.subscribeRepository.findById(id);
    if (!subscribe) throw new BadGatewayException('Subscription not found or inactive');
    await this.subscribeRepository.update(id, { ...data, subscribedAt: data.status === SubscriptionStatus.ACTIVE ? new Date() : subscribe.subscribedAt });
    return new Result({message: 'Subscription preferences updated successfully' });
  }

  async getAllActiveSubscribers() {
    const subscribers = await this.subscribeRepository.find({where: { status: SubscriptionStatus.ACTIVE }});
    return new Result({data: subscribers});
  }

  async getAllSubscribers() {
    const subscribers = await this.subscribeRepository.find({});
    return new Result({data: subscribers});
  }

  async createSubscriber(data: GetSubscriptionRequest) {
    const subscriber = this.subscribeRepository.create(data)
    return new Result({
      message: 'Subscriber created successfully.',
      data: subscriber,
    })
  }

  async deleteSubscriber(id: string) {
    const subscriber = await this.subscribeRepository.findOne({
      where: { id, status: SubscriptionStatus.UNSUBSCRIBED },
    });

    if (!subscriber) throw new BadGatewayException('Subscriber not found or still active');

    await this.subscribeRepository.delete(subscriber.id);

    return new Result({ message: 'Subscriber deleted successfully' });
  }
}
