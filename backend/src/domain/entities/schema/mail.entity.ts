import { Entity, Column, ManyToMany, JoinTable } from 'typeorm'

import { RepeatUnit } from '@domain/common/enum/subscribeTypes'

import { BaseSoftDelete } from '../base'

import { Subscribe } from './subscribe.entity'

@Entity()
export class Mail extends BaseSoftDelete {
  @Column()
  title: string

  @Column()
  subject: string

  @Column({ type: 'text' })
  content: string

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

  @ManyToMany(() => Subscribe, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'mail_subscribers',
    joinColumn: { name: 'mail_id' },
    inverseJoinColumn: { name: 'subscriber_id' },
  })
  subscribers: Subscribe[]
}
