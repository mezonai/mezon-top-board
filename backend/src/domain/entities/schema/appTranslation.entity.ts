import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "@domain/entities/base";
import { AppLanguage } from "@domain/common/enum/appLanguage";
import { App } from "./app.entity";
import { AppVersion } from "./appVersion.entity";

@Entity({ name: "app_translation" })
export class AppTranslation extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({ nullable: true })
  public appId: string;

  @Column({ nullable: true })
  public appVersionId: string;

  @Column({
    type: "enum",
    enum: AppLanguage,
    default: AppLanguage.EN,
  })
  public language: AppLanguage;

  @Column()
  public name: string;

  @Column({ nullable: true })
  public headline: string;

  @Column({ type: "text", nullable: true })
  public description: string;

  @ManyToOne(() => App, (app) => app.appTranslations, { onDelete: "CASCADE" })
  @JoinColumn({ name: "appId" })
  public app: App;

  @ManyToOne(() => AppVersion, (version) => version.appTranslations, { onDelete: "CASCADE" })
  @JoinColumn({ name: "appVersionId" })
  public appVersion: AppVersion;
}