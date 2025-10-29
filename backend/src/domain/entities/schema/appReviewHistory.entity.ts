import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";

import { AppVersion, User } from "@domain/entities";

import { BaseSoftDelete } from "../base";

@Entity()
export class AppReviewHistory extends BaseSoftDelete {
    @Column({ default: false })
    public isApproved: boolean;

    @Column()
    public appVersionId: string;

    @Column()
    public reviewerId: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    public reviewedAt: Date;

    @Column()
    public remark: string;

    @ManyToOne(() => AppVersion, (version) => version.reviewHistories, { onDelete: "CASCADE" })
    @JoinColumn({ name: "appVersionId" })
    public appVersion: AppVersion;

    @ManyToOne(() => User, (user) => user.id, { onDelete: "CASCADE" })
    @JoinColumn({ name: "reviewerId" })
    reviewer: User;
}
