import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Mail } from '@domain/entities/schema/mail.entity';
import { Subscribe } from '@domain/entities/schema/subscribe.entity';

import { MailModule } from '@features/mail/mail.module';

import { SubscribeController } from './subscribe.controller';
import { SubscribeService } from './subscribe.service';



@Module({
  controllers: [SubscribeController],
  providers: [SubscribeService],
  imports: [
    TypeOrmModule.forFeature([Subscribe,Mail]),
    MailModule,
    ScheduleModule.forRoot()
  ],
})
export class SubscribeModule {}
  