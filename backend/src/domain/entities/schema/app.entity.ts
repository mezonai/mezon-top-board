import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, Unique } from "typeorm";

import { AppStatus } from "@domain/common/enum/appStatus";
import { Link, AppReviewHistory, Rating, Tag, User, AppVersion, UserFavorite } from "@domain/entities";

import { BaseSoftDelete } from "../base";
import { MezonAppType } from "@domain/common/enum/mezonAppType";
import { AppPricing } from "@domain/common/enum/appPricing";
import { BaseApp } from "@domain/entities/base/baseApp.entity";

@Entity()
export class App extends BaseApp {
    @Column()
    public ownerId: string;

    @Column({ type: "integer", default: 1 })
    public currentVersion: number;

    @Column({ default: false })
    public hasNewUpdate: boolean;

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

    @OneToMany(() => UserFavorite, (favorite) => favorite.app)
    public favorites: UserFavorite[];

    @OneToMany(() => AppReviewHistory, (review) => review.app)
    reviewHistories: AppReviewHistory[];

    @OneToMany(() => Rating, (rating) => rating.app)
    ratings: Rating[];

    @ManyToOne(() => User, (user) => user.apps, { onDelete: "CASCADE" })
    @JoinColumn({ name: "ownerId" })
    owner: User;

    @OneToMany(() => AppVersion, (version) => version.app)
    public versions: AppVersion[];
}
