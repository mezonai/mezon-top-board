import { Entity, Column, ManyToMany } from 'typeorm'

import { SubscriptionStatus } from '@domain/common/enum/subscribeTypes'
import { Mail } from '@domain/entities/schema/mail.entity'

import { BaseSoftDelete } from '../base'


@Entity()
export class Subscribe extends BaseSoftDelete {
  @Column({ unique: true })
  public email: string

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.PENDING,
  })
  public status: SubscriptionStatus

  @Column({ nullable: true })
  public confirmationToken?: string

  @Column({ type: 'timestamptz', nullable: true })
  public confirmationTokenExpires?: Date

  @Column({ type: 'timestamptz', nullable: true })
  public subscribedAt: Date

  @Column({ type: 'timestamptz', nullable: true })
  public unsubscribedAt?: Date

  @ManyToMany(() => Mail, (mail) => mail.subscribers)
  mails: Mail[]
}
