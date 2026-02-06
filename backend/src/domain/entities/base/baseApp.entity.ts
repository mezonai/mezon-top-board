import { Entity, Column } from "typeorm";
import { AppPricing } from "@domain/common/enum/appPricing";
import { AppStatus } from "@domain/common/enum/appStatus";
import { BaseSoftDelete } from "@domain/entities/base";
import { AppLanguage } from "@domain/common/enum/appLanguage";

@Entity({ name: "BaseApp" })
export class BaseApp extends BaseSoftDelete {
  @Column({
    type: "enum",
    enum: AppStatus,
    default: AppStatus.PENDING,
  })
  public status: AppStatus;

  @Column({ default: false })
  public isAutoPublished: boolean;

  @Column({ nullable: true })
  public prefix: string;

  @Column({ nullable: true })
  public featuredImage: string;

  @Column({ nullable: true })
  public supportUrl: string;

  @Column({
    type: "enum",
    enum: AppPricing,
    default: AppPricing.FREE,
  })
  public pricingTag: AppPricing;

  @Column({
    type: "decimal",
    precision: 15,
    scale: 0,
    nullable: true,
  })
  public price: number | null;

  @Column({
    type: "enum",
    enum: AppLanguage,
    default: AppLanguage.EN,
  })
  public defaultLanguage: AppLanguage;
}