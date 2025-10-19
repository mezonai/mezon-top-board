import { Entity, Column, ManyToMany } from 'typeorm'

import { RepeatUnit, SubscriptionStatus } from '@domain/common/enum/subscribeTypes'
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

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  public subscribedAt: Date

  @Column({ type: 'int', nullable: true })
  public repeatEvery?: number

  @Column({
    type: 'enum',
    enum: RepeatUnit,
    default: RepeatUnit.DAY,
  })
  public repeatUnit: RepeatUnit

  @Column({ default: false })
  public isRepeatable: boolean

  @Column({ type: 'time', nullable: true })
  public sendTime?: string

  @Column({ type: 'timestamptz', nullable: true })
  public lastSentAt?: Date

  @Column({ type: 'timestamptz', nullable: true })
  public unsubscribedAt?: Date

  @ManyToMany(() => Mail, (mail) => mail.subscribers)
  mails: Mail[]
}
