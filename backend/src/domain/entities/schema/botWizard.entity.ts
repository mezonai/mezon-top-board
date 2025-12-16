import {
    Column,
    Entity,
    ManyToOne,
    JoinColumn,
    OneToOne,
} from "typeorm";

import { BaseSoftDelete } from "../base";
import { User } from "@domain/entities/schema/user.entity";
import { BotWizardStatus } from "@domain/common/enum/botWizardStatus";
import { TempFile } from "@domain/entities/schema/tempFile.entity";

@Entity()
export class BotWizard extends BaseSoftDelete {
    @Column()
    public botName: string;

    @Column({ nullable: true, type: "enum", enum: Object.keys(BotWizardStatus) })
    public status: BotWizardStatus;

    @Column({ type: "jsonb", nullable: true })
    public templateJson: Record<string, string[]> | null;

    @Column({ nullable: true })
    public ownerId: string;

    @ManyToOne(() => User, (user) => user.botWizards, { onDelete: "CASCADE" })
    @JoinColumn({ name: "ownerId" })
    public owner: User;

    @OneToOne(() => TempFile, (file) => file.botWizard)
    public tempFile: TempFile;
}
