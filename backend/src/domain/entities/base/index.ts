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

  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  public updatedAt: Date;
}

@Entity({ name: "BaseSoftDelete" })
export class BaseSoftDelete extends BaseEntity {
  @DeleteDateColumn({ type: 'timestamptz' })
  public deletedAt: Date;
}
