import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, Unique } from "typeorm";

import { AppStatus } from "@domain/common/enum/appStatus";
import { Link, AppReviewHistory, Rating, Tag, User } from "@domain/entities";

import { BaseSoftDelete } from "../base";
import { MezonAppType } from "@domain/common/enum/mezonAppType";

@Entity()
export class App extends BaseSoftDelete {
    @Column()
    public name: string;

    @Column()
    public ownerId: string;

    @Column({
        type: "enum",
        enum: AppStatus,
        default: AppStatus.PENDING,
    })
    public status: AppStatus;

    @Column({ default: false })
    public isAutoPublished: boolean;

    @Column({ nullable: true })
    public mezonAppId: string;

    @Column({
        type: "enum",
        enum: MezonAppType,
        default: MezonAppType.BOT,
    })
    public type: MezonAppType;

    @Column({ nullable: true })
    public headline: string;

    @Column({ nullable: true })
    public description: string;

    @Column({ nullable: true })
    public prefix: string;

    @Column({ nullable: true })
    public featuredImage: string;

    @Column({ nullable: true })
    public supportUrl: string;

    @Column({ nullable: true })
    public remark: string;

    @ManyToMany(() => Tag, (tag) => tag.apps)
    @JoinTable()
    public tags: Tag[];

    @ManyToMany(() => Link, (link) => link.apps)
    @JoinTable()
    public socialLinks: Link[];

    @OneToMany(() => AppReviewHistory, (review) => review.app)
    reviewHistories: AppReviewHistory[];

    @OneToMany(() => Rating, (rating) => rating.app)
    ratings: Rating[];

    @ManyToOne(() => User, (user) => user.apps, { onDelete: "CASCADE" })
    @JoinColumn({ name: "ownerId" })
    owner: User;
}
