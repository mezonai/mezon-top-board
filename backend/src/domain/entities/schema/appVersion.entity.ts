import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, } from 'typeorm';

import { BaseApp } from '@domain/entities/base/baseApp.entity';
import { AppReviewHistory } from '@domain/entities/schema/appReviewHistory.entity';
import { Link } from '@domain/entities/schema/link.entity';
import { Tag } from '@domain/entities/schema/tag.entity';

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

  @ManyToMany(() => Tag)
  @JoinTable({
    name: "app_version_tags",
    joinColumn: { name: "appVersionId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "tagId", referencedColumnName: "id" },
  })
  tags: Tag[];

  @ManyToMany(() => Link, (link) => link.id)
  @JoinTable({
    name: "app_version_links",
    joinColumn: { name: "appVersionId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "linkId", referencedColumnName: "id" },
  })
  public socialLinks: Link[];

  @OneToMany(() => AppReviewHistory, (review) => review.appVersion)
  public reviewHistories: AppReviewHistory[];
}
