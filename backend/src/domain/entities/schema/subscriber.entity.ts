import { Entity, Column } from "typeorm";
import { BaseSoftDelete } from "../base";

@Entity('subscribers')
export class Subscriber extends BaseSoftDelete {
  @Column({ unique: true })
  public email: string;
}
