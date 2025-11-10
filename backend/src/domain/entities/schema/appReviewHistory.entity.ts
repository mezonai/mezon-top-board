import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";

import { App, AppVersion, User } from "@domain/entities";

import { BaseSoftDelete } from "../base";

@Entity()
export class AppReviewHistory extends BaseSoftDelete {
    @Column()
    public appId: string;

    @Column()
    public appVersionId: string;
    
    @Column({ default: false })
    public isApproved: boolean;

    @Column()
    public reviewerId: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    public reviewedAt: Date;

    @Column()
    public remark: string;

    @ManyToOne(() => App, (app) => app.reviewHistories, { onDelete: "CASCADE" })
    @JoinColumn({ name: "appId" })
    app: App;

    @ManyToOne(() => AppVersion, (version) => version.reviewHistories, { onDelete: "CASCADE" })
    @JoinColumn({ name: "appVersionId" })
    appVersion: AppVersion;

    @ManyToOne(() => User, (user) => user.id, { onDelete: "CASCADE" })
    @JoinColumn({ name: "reviewerId" })
    reviewer: User;
}
