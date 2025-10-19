import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Queue } from 'bullmq';
import { EntityManager, In } from 'typeorm';

import { Result } from '@domain/common/dtos/result.dto';
import { SubscriptionStatus } from '@domain/common/enum/subscribeTypes';
import { Mail } from '@domain/entities/schema/mail.entity';
import { Subscribe } from '@domain/entities/schema/subscribe.entity';

import { CreateMailRequest } from '@features/mail/dtos/request';

import { GenericRepository } from '@libs/repository/genericRepository';

@Injectable()
export class MailService {
  private readonly subscribeRepository: GenericRepository<Subscribe>;
  private readonly mailRepository: GenericRepository<Mail>;

  constructor(
    private manager: EntityManager,
    @InjectQueue('mail-queue') private readonly mailQueue: Queue,
) {
  this.subscribeRepository = new GenericRepository(Subscribe, manager);
  this.mailRepository = new GenericRepository(Mail, manager);
}

  async sendNewsletter(email: string, subject: string,html: string) {
    return this.mailQueue.add(
    'sendMail',
    { email, subject, html },
    { attempts: 3, backoff: 5000, removeOnComplete: true },
  )
  }

  async sendConfirmMail(email: string, token: string) {
    return this.mailQueue.add(
      'sendMail',
      {
        email,
        subject: 'Xác nhận đăng ký',
        template: 'confirm',
        context: { url: `${process.env.URL_SERVER}/subscribe/confirm/${token}`, },
      },
      { attempts: 3, backoff: 5000, removeOnComplete: true },
    );
  }

  async createMail(data: CreateMailRequest) {
    const subscribers = await this.subscribeRepository.find({
      where: {
        id: In(data.subscriberIds),
        status: SubscriptionStatus.ACTIVE,
      },
    })

    if (subscribers.length === 0)
      throw new NotFoundException('No valid subscribers found.')

    await this.mailRepository.create({
      title: data.title,
      subject: data.subject,
      content: data.content,
      subscribers,
    })

    return new Result({ message: 'Mail created successfully.' })
  }

  async createMailAndSendMail(data: CreateMailRequest) {
    const subscribers = await this.subscribeRepository.find({
      where: {
        id: In(data.subscriberIds),
        status: SubscriptionStatus.ACTIVE,
      },
    })

    if (subscribers.length === 0)
      throw new NotFoundException('No valid subscribers found.')

    await this.mailRepository.create({
      title: data.title,
      subject: data.subject,
      content: data.content,
      subscribers,
    })

    for (const sub of subscribers) {
      await this.sendNewsletter(sub.email, data.subject, data.content)
    }

    return new Result({message: 'Mail created and newsletters are being sent.'})
  }

  async getAllMails() {
    const mails = await this.mailRepository.find({ relations: ['subscribers'] });
    return new Result({ data: mails });
  }

  async updateMail(id: string, data: Partial<CreateMailRequest>) {
    const mail = await this.mailRepository.findOne({
      where: { id },
      relations: ['subscribers'],
    });
    if (!mail) throw new NotFoundException('Mail not found');
    if (data.subscriberIds && Array.isArray(data.subscriberIds)) {
      const subscribers = await this.subscribeRepository.getRepository().findBy({
        id: In(data.subscriberIds),
      });
      mail.subscribers = subscribers;
    }

    if (data.title !== undefined) mail.title = data.title;
    if (data.subject !== undefined) mail.subject = data.subject;
    if (data.content !== undefined) mail.content = data.content;

    await this.mailRepository.getRepository().save(mail);

    return new Result<Mail>({
      data: mail,
      message: 'Mail updated successfully.',
    });
  }

  async deleteMail(id: string) {
    const mail = await this.mailRepository.findOne({
      where: { id },
      relations: ['subscribers'],
    });

    if (!mail) throw new NotFoundException('Mail not found');

    await this.mailRepository.delete(mail.id);

    return new Result({ message: 'Mail deleted successfully.' });
  }
}
