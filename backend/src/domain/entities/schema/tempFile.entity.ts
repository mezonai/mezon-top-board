import {
    Column,
    Entity,
    ManyToOne,
    JoinColumn,
    OneToOne,
} from "typeorm";

import { BaseSoftDelete } from "../base";
import { User } from "@domain/entities/schema/user.entity";
import { BotWizard } from "@domain/entities/schema/botWizard.entity";

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

    @Column({ nullable: true, unique: true })
    public botWizardId: string;

    @OneToOne(() => BotWizard, (bot) => bot.tempFile, { onDelete: "CASCADE", })
    @JoinColumn({ name: "botWizardId" })
    public botWizard: BotWizard;
}
