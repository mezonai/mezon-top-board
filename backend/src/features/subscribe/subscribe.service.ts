import { BadGatewayException, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import * as crypto from 'crypto'
import { differenceInDays, differenceInMonths, differenceInWeeks, differenceInYears } from 'date-fns';
import { Response } from 'express';
import { EntityManager } from 'typeorm';

import { Result } from '@domain/common/dtos/result.dto';
import { RepeatUnit, SubscriptionStatus } from '@domain/common/enum/subscribeTypes';
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
    });
    return res.redirect(
        `${config().URL_CLIENT}/confirm-subscribe/success?message=Subscription confirmed successfully`,
    );
  }

  async unsubscribe(email: string) {
    const subscribe = await this.subscribeRepository.findOne({
      where: {
        email,
        status: SubscriptionStatus.ACTIVE,
      },
    });
    if (!subscribe) {
      throw new Error('Subscription not found or already unsubscribed');
    }
    await this.subscribeRepository.update(subscribe.id, {
      status: SubscriptionStatus.UNSUBSCRIBED,
      unsubscribedAt: new Date(),
      isRepeatable: false,
      repeatEvery: null,
    });
    return new Result({message: 'Unsubscribed successfully' });
  }

  async updateSubscriptionPreferences(id: string, data: Partial<GetSubscriptionRequest>) {
    const subscribe = await this.subscribeRepository.findOne({
      where: {
        id,
        status: SubscriptionStatus.ACTIVE,
      },
    });
    if (!subscribe) throw new BadGatewayException('Subscription not found or inactive');
    await this.subscribeRepository.update(id, data);
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
      where: { id },
    })
    const mails = await this.mailRepository.findOne({
      relations: ['subscribers'],
      where: { subscribers: { id } },
    });

    if (!subscriber) throw new BadGatewayException('Subscriber not found')
    if (!mails) {
      await this.subscribeRepository.delete(subscriber.id)
      return new Result({ message: 'Subscriber deleted successfully' })
    }

    await this.mailRepository.update(mails.id, {
      subscribers: mails.subscribers.filter((s) => s.id !== id),
    });

    await this.subscribeRepository.delete(subscriber.id)

    return new Result({ message: 'Subscriber deleted successfully' })
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleMailSchedule() {
    const now = new Date()
    const vnNow = new Date(now.getTime() + 7 * 60 * 60 * 1000)

    const mails = await this.mailRepository.getRepository().find({
      relations: ['subscribers'],
    });
    if(!mails.length) console.log("No mails found for scheduling");
    for (const mail of mails) {
      if(!mail.subscribers?.length) continue;
      for (const sub of mail.subscribers) {
        const shouldSend = this.shouldSendNow(sub, vnNow);
        if(shouldSend){
          const send = await this.mailService.sendNewsletter(sub.email, mail.subject, mail.content);
          await this.subscribeRepository.update(sub.id, { lastSentAt: now });
          if(!send) console.log(`Failed to send mail to ${sub.email}`);
          console.log(`Sent mail to ${sub.email} at ${vnNow.toISOString()}`);
        }
      }
    }
  }

  private shouldSendNow(sub: Subscribe, now: Date): boolean {
    if (sub.unsubscribedAt || !sub.isRepeatable || sub.status !== SubscriptionStatus.ACTIVE) return false;

    if (sub.sendTime) {
      const [hour, minute] = sub.sendTime.split(':').map(Number);
      if (now.getHours() !== hour || now.getMinutes() !== minute) return false;
      if (!sub.lastSentAt) return true;

      const last = sub.lastSentAt;
      switch (sub.repeatUnit) {
        case RepeatUnit.DAY:
          return differenceInDays(now, last) >= (sub.repeatEvery ?? 1);
        case RepeatUnit.WEEK:
          return differenceInWeeks(now, last) >= (sub.repeatEvery ?? 1);
        case RepeatUnit.MONTH:
          return differenceInMonths(now, last) >= (sub.repeatEvery ?? 1);
        case RepeatUnit.YEAR:
          return differenceInYears(now, last) >= (sub.repeatEvery ?? 1);
        default:
          return false;
      }
    }
  }
}
