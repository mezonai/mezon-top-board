import {
    Column,
    Entity,
    ManyToOne,
    JoinColumn,
} from "typeorm";

import { BaseSoftDelete } from "../base";
import { User } from "@domain/entities/schema/user.entity";
import { TempSourceFileStatus } from "@domain/common/enum/tempSourceFileStatus";

@Entity()
export class TempSourceFile extends BaseSoftDelete {
    @Column()
    public fileName: string;

    @Column({ nullable: true })
    public filePath: string;

    @Column({ type: "enum", enum: Object.keys(TempSourceFileStatus),default: TempSourceFileStatus.PROCESSING, })
    public status: TempSourceFileStatus;

    @Column({ type: "timestamptz", nullable: true })
    public completedAt: Date | null;

    @Column({ nullable: true })
    public ownerId: string;

    @ManyToOne(() => User, (user) => user.tempSourceFiles, { onDelete: "CASCADE" })
    @JoinColumn({ name: "ownerId" })
    public owner: User;
}
