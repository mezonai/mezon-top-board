import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, } from 'typeorm';

import { AppReviewHistory } from '@domain/entities/schema/appReviewHistory.entity';
import { Link } from '@domain/entities/schema/link.entity';
import { Tag } from '@domain/entities/schema/tag.entity';

import { BaseApp } from '../base';

import { App } from './app.entity';

@Entity()
export class AppVersion extends BaseApp {
  @Column()
  public appId: string;

  @Column({ type: 'integer', generated: 'increment' })
  public version: number;

  @Column({ nullable: true })
  public changelog?: string;

  @ManyToOne(() => App, (app) => app.versions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'appId' })
  public app: App;

  @ManyToMany(() => Tag, (tag) => tag.appVersions)
  @JoinTable()
  public tags: Tag[];

  @ManyToMany(() => Link, (link) => link.apps)
  @JoinTable()
  public socialLinks: Link[];

  @OneToMany(() => AppReviewHistory, (review) => review.appVersion)
  public reviewHistories: AppReviewHistory[];
}
