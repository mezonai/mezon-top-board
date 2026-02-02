import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "../base";
import { App, AppVersion } from "@domain/entities";
import { AppLanguage } from "@domain/common/enum/appLanguage";

@Entity({ name: "app_translation" })
export class AppTranslation extends BaseEntity {
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

  @Column({ nullable: true })
  public appId: string;

  @Column({ nullable: true })
  public appVersionId: string;

  @ManyToOne(() => App, (app) => app.translations, { onDelete: "CASCADE" })
  @JoinColumn({ name: "appId" })
  public app: App;

  @ManyToOne(() => AppVersion, (version) => version.translations, { onDelete: "CASCADE" })
  @JoinColumn({ name: "appVersionId" })
  public version: AppVersion;
}