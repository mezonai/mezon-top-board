import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SubscriberService } from "./subscriber.service";
import { SubscriberController } from "./subscriber.controller";
import { Subscriber } from "@domain/entities/schema/subscriber.entity";
import { MailModule } from "../mail/mail.module";
import { BullModule } from "@nestjs/bull";

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscriber]),
    BullModule.registerQueue({
      name: "email",
    }),
    MailModule,
  ],
  providers: [SubscriberService],
  controllers: [SubscriberController],
  exports: [SubscriberService],
})
export class SubscriberModule {}