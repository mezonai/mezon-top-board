import { Entity, Column } from 'typeorm'

import { EmailSubscriptionStatus } from '@domain/common/enum/subscribeTypes'

import { BaseSoftDelete } from '../base'


@Entity()
export class Subscriber extends BaseSoftDelete {
  @Column({ type: 'varchar', unique: true })
  public email: string

  @Column({
    type: 'enum',
    enum: EmailSubscriptionStatus,
    default: EmailSubscriptionStatus.PENDING,
  })
  public status: EmailSubscriptionStatus
}
