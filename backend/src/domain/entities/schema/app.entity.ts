import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";

import { MezonAppType } from "@domain/common/enum/mezonAppType";
import { Link, AppReviewHistory, Rating, Tag, User, AppVersion } from "@domain/entities";

import { BaseApp } from "../base";


@Entity()
export class App extends BaseApp {
    @Column()
    public ownerId: string;

    @Column({ type: "integer", nullable: true })
    public currentVersion: number;

    @Column({ nullable: true })
    public mezonAppId: string;

    @Column({
        type: "enum",
        enum: MezonAppType,
        default: MezonAppType.BOT,
    })
    public type: MezonAppType;

    @ManyToMany(() => Tag, (tag) => tag.apps)
    @JoinTable()
    public tags: Tag[];

    @ManyToMany(() => Link, (link) => link.apps)
    @JoinTable()
    public socialLinks: Link[];

    @OneToMany(() => Rating, (rating) => rating.app)
    ratings: Rating[];

    @ManyToOne(() => User, (user) => user.apps, { onDelete: "CASCADE" })
    @JoinColumn({ name: "ownerId" })
    owner: User;

    @OneToMany(() => AppReviewHistory, (review) => review.app)
    public reviewHistories: AppReviewHistory[];

    @OneToMany(() => AppVersion, (version) => version.app)
    public versions: AppVersion[];
}
