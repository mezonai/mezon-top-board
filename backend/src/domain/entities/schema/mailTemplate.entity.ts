import { Entity, Column } from 'typeorm'

import { RepeatInterval } from '@domain/common/enum/subscribeTypes'

import { BaseSoftDelete } from '../base'

@Entity()
export class MailTemplate extends BaseSoftDelete {

  @Column({ type: 'varchar', length: 255 })
  subject: string

  @Column({ type: 'text' })
  content: string

  @Column({ type: 'timestamptz', nullable: true })
  public scheduledAt?: Date

  @Column({ type: 'boolean', default: false })
  public isRepeatable: boolean

  @Column({
    type: 'enum',
    enum: RepeatInterval,
    default: RepeatInterval.DAILY,
  })
  public repeatInterval: RepeatInterval
}
