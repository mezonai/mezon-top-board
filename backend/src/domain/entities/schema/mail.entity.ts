import { Entity, Column, ManyToMany, JoinTable } from 'typeorm'

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

  @ManyToMany(() => Subscribe, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'mail_subscribers',
    joinColumn: { name: 'mail_id' },
    inverseJoinColumn: { name: 'subscriber_id' },
  })
  subscribers: Subscribe[]
}
