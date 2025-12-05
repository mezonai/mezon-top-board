import {
    Column,
    Entity,
    ManyToOne,
    JoinColumn,
} from "typeorm";

import { BaseSoftDelete } from "../base";
import { User } from "@domain/entities/schema/user.entity";

@Entity()
export class TempFile extends BaseSoftDelete {
    @Column()
    public fileName: string;

    @Column({ nullable: true })
    public filePath: string;

    @Column({ nullable: true })
    public mimeType: string;

    @Column({ type: "timestamptz", nullable: true })
    public expiredAt: Date | null;

    @Column({ nullable: true })
    public ownerId: string;

    @ManyToOne(() => User, (user) => user.tempFiles, { onDelete: "CASCADE" })
    @JoinColumn({ name: "ownerId" })
    public owner: User;
}
