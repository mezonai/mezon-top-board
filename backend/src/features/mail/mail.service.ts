import { InjectQueue } from '@nestjs/bullmq';
import { BadGatewayException, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { Queue } from 'bullmq';
import { differenceInDays, differenceInMonths, differenceInWeeks, differenceInYears } from 'date-fns';
import { EntityManager } from 'typeorm';

import { Result } from '@domain/common/dtos/result.dto';
import { RepeatUnit, SubscriptionStatus } from '@domain/common/enum/subscribeTypes';
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
    { email, 
      subject,
      template: 'master',
      context:{
        subject: subject,
        content: html, 
        unsubscribeUrl: `${process.env.URL_SERVER}/subscribe/unsubscribe/${email}`,  
        brandName: 'NCCPLUS', 
        logoUrl: `https://res.cloudinary.com/dh3q44nkl/image/upload/v1760928694/Logo_ncc_obolhf.png`, 
        preheaderText: 'Đừng bỏ lỡ bản tin mới nhất từ NCCPLUS', 
        year: new Date().getFullYear() 
      },
    },
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
        context: {
          url: `${process.env.URL_SERVER}/subscribe/confirm/${token}`, 
          logoUrl: `https://res.cloudinary.com/dh3q44nkl/image/upload/v1760928694/Logo_ncc_obolhf.png` 
        },
      },
      { attempts: 3, backoff: 5000, removeOnComplete: true },
    );
  }

  async createMailAndSendMail(data: CreateMailRequest) {
    const subscribers = await this.subscribeRepository.find({
      where: { status: SubscriptionStatus.ACTIVE },
    })

    if (subscribers.length === 0) throw new BadGatewayException('No valid subscribers found.')

    await this.mailRepository.create({
      ...data,
      subscribers,
    })
    if(!data.isRepeatable){
      for (const sub of subscribers) {
      await this.sendNewsletter(sub.email, data.subject, data.content)
    }
    }
    return new Result({message: 'Mail created and newsletters are being sent.'})
  }

  async getAllMails() {
    const mails = await this.mailRepository.find({ relations: ['subscribers'] });
    return new Result({ data: mails });
  }

  async updateMail(id: string, data: Partial<CreateMailRequest>) {
    const mail = await this.mailRepository.findOne({where: { id }});
    if (!mail) throw new BadGatewayException('Mail not found');
    await this.mailRepository.update(mail.id, data);

    return new Result<Mail>({
      data: mail,
      message: 'Mail updated successfully.',
    });
  }

  async deleteMail(id: string) {
    const mail = await this.mailRepository.findOne({where: { id }});

    if (!mail) throw new BadGatewayException('Mail not found');

    await this.mailRepository.delete(mail.id);

    return new Result({ message: 'Mail deleted successfully.' });
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleMailSchedule() {
    const now = new Date()
    const vnNow = new Date(now.getTime() + 7 * 60 * 60 * 1000)

    const mails = await this.mailRepository.getRepository().find({
      relations: ['subscribers'],
    });
    for (const mail of mails) {
      if(!mail.subscribers?.length) continue;
      for (const sub of mail.subscribers) {
        const shouldSend = this.shouldSendNow(mail, sub, vnNow);
        if(shouldSend){
          const send = await this.sendNewsletter(sub.email, mail.subject, mail.content);
          await this.mailRepository.update(mail.id, { lastSentAt: now });
          if(!send) console.log(`Failed to send mail to ${sub.email}`);
          console.log(`Sent mail to ${sub.email} at ${vnNow.toISOString()}`);
        }
      }
    }
  }

  private shouldSendNow(mail: Mail, sub: Subscribe, now: Date): boolean {
    if (sub.status !== SubscriptionStatus.ACTIVE || !mail.isRepeatable) return false;

    if (mail.sendTime) {
      const [hour, minute] = mail.sendTime.split(':').map(Number);
      if (now.getHours() !== hour || now.getMinutes() !== minute) return false;
      if (!mail.lastSentAt) return true;

      const last = mail.lastSentAt;
      switch (mail.repeatUnit) {
        case RepeatUnit.DAY:
          return differenceInDays(now, last) >= (mail.repeatEvery ?? 1);
        case RepeatUnit.WEEK:
          return differenceInWeeks(now, last) >= (mail.repeatEvery ?? 1);
        case RepeatUnit.MONTH:
          return differenceInMonths(now, last) >= (mail.repeatEvery ?? 1);
        case RepeatUnit.YEAR:
          return differenceInYears(now, last) >= (mail.repeatEvery ?? 1);
        default:
          return false;
      }
    }
  }
}
