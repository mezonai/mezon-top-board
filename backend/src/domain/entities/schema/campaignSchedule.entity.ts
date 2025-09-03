import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import { BaseSoftDelete } from "../base";
import { IntervalUnit, ScheduleMode } from "@domain/common/enum/schedule";



@Entity()
export class NewsletterSchedule extends BaseSoftDelete {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar" })
  mode: ScheduleMode;

  @Column("int", { array: true, nullable: true })
  fixedHours: number[]; 

  @Column({ type: "int", nullable: true })
  intervalValue: number;

  @Column({ type: "varchar", nullable: true })
  intervalUnit: IntervalUnit;

  @CreateDateColumn()
  createdAt: Date;
}
