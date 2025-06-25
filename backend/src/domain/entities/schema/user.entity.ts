import {
    Column,
    Entity,
    JoinTable,
    OneToMany,
    Unique,
} from "typeorm";

import { Role } from "@domain/common/enum/role";
import { App, Link, Media, Rating } from "@domain/entities";

import { BaseSoftDelete } from "../base";

@Entity()
@Unique(["email"])
export class User extends BaseSoftDelete {
    @Column({ nullable: true, default: '' })
    public name: string | null;

    @Column()
    public email: string;

    @Column({ nullable: true, default: null })
    public password: string;

    @Column({ type: "enum", enum: Object.keys(Role), default: Role.DEVELOPER })
    public role: Role;

    @Column({ nullable: true, default: null })
    public bio: string;

    @Column({ nullable: true })
    public profileImage: string;

    @Column({ default: false })
    public willSyncFromMezon: boolean;

    @OneToMany(() => Rating, (rating) => rating.user)
    public ratings: Rating[];

    @OneToMany(() => App, (app) => app.owner)
    public apps: App[];

    @OneToMany(() => Link, (link) => link.owner)
    @JoinTable()
    public links: Link[];

    @OneToMany(() => Media, (media) => media.owner)
    public medias: Media[];
}