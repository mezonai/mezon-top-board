import { Column, Entity, ManyToOne } from "typeorm";
import { NewsletterCampaign } from "./newsletterCampaign.entity";
import { Subscriber } from "./subscriber.entity";
import { BaseSoftDelete } from "../base";

@Entity()
export class CampaignDelivery extends BaseSoftDelete {

  @ManyToOne(() => NewsletterCampaign)
  campaign: NewsletterCampaign;

  @ManyToOne(() => Subscriber)
  subscriber: Subscriber;

  @Column({ type: 'boolean', default: false })
  delivered: boolean;

  @Column({ type: 'timestamp', nullable: true })
  deliveredAt?: Date;
}
