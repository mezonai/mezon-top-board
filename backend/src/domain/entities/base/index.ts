import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";

// Base class containing common properties
@Entity({ name: "BaseEntity" })
export class BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}

@Entity({ name: "BaseSoftDelete" })
export class BaseSoftDelete extends BaseEntity {
  @DeleteDateColumn()
  public deletedAt: Date;
}
