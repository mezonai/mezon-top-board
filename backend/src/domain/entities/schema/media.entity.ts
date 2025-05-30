import { Column, Entity, ManyToOne } from "typeorm";

import { BaseSoftDelete } from "../base";

import { User } from "./user.entity";

@Entity()
export class Media extends BaseSoftDelete {
  @Column()
  public fileName: string;

  @Column({ nullable: true })
  public mimeType: string;

  @Column({ nullable: true })
  public filePath: string;

  @Column({ nullable: true })
  public ownerId: string;

  @ManyToOne(() => User, (user) => user.medias)
  public owner: User;
}
