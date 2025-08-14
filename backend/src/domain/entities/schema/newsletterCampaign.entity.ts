import { Column, Entity } from "typeorm";
import { BaseSoftDelete } from "../base";

@Entity()
export class NewsletterCampaign extends BaseSoftDelete {
  @Column({ length: 255 })
  public title: string;

  @Column({ length: 255, nullable: true })
  public headline: string;

  @Column({ type: "text", nullable: true }) 
  public description: string;
}