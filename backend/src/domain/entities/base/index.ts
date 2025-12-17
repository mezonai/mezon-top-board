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

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  public updatedAt: Date;
}

@Entity({ name: "BaseSoftDelete" })
export class BaseSoftDelete extends BaseEntity {
  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  public deletedAt: Date;
}
