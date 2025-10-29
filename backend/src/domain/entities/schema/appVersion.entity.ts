import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { AppPricing } from '@domain/common/enum/appPricing';
import { AppStatus } from '@domain/common/enum/appStatus';
import { AppReviewHistory } from '@domain/entities/schema/appReviewHistory.entity';
import { Link } from '@domain/entities/schema/link.entity';
import { Tag } from '@domain/entities/schema/tag.entity';

import { BaseSoftDelete } from '../base';

import { App } from './app.entity';

@Entity()
export class AppVersion extends BaseSoftDelete {
  @Column()
  public appId: string;

  @ManyToOne(() => App, (app) => app.versions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'appId' })
  public app: App;

  @Column()
  public name: string;

  @Column({
    type: 'enum',
    enum: AppStatus,
    default: AppStatus.PENDING,
  })
  public status: AppStatus;

  @Column({ default: false })
  public isAutoPublished: boolean;

  @Column({ nullable: true })
  public headline: string;

  @Column({ nullable: true })
  public description: string;

  @Column({ nullable: true })
  public prefix: string;

  @Column({ nullable: true })
  public featuredImage: string;

  @Column({ nullable: true })
  public supportUrl: string;

  @Column({ nullable: true })
  public remark: string;

  @ManyToMany(() => Tag, (tag) => tag.appVersions)
  @JoinTable()
  public tags: Tag[];

  @Column({
    type: 'enum',
    enum: AppPricing,
    default: AppPricing.FREE,
  })
  public pricingTag: AppPricing;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 0,
    nullable: true,
  })
  public price: number | null;

  @ManyToMany(() => Link, (link) => link.apps)
  @JoinTable()
  public socialLinks: Link[];
  
  @Column()
  public version: string;

  @Column({ nullable: true })
  public changelog?: string;

  @Column({ nullable: true })
  public approvedAt?: Date;

  @Column({ nullable: true })
  public approvedBy?: string;

  @OneToMany(() => AppReviewHistory, (review) => review.appVersion)
  public reviewHistories: AppReviewHistory[];
}
