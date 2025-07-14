import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';


import { SubscriberService } from './subscriber.service';
import { SubscriberController } from './subscriber.controller';
import { Subscriber } from '@domain/entities/schema/subscriber.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subscriber])],
  providers: [SubscriberService],
  controllers: [SubscriberController],
  exports: [SubscriberService], 
})
export class SubscriberModule {}