import { Entity, Column } from "typeorm";
import { BaseSoftDelete } from "../base";

@Entity("subscribers")
export class Subscriber extends BaseSoftDelete {
  @Column({ unique: true })
  public email: string;

  @Column({ length: 64, nullable: true })
  public confirmToken: string;

  @Column({ default: false })
  public isConfirmed: boolean;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  public subscribedAt: Date;
}
