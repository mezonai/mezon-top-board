import { Entity, Column, ManyToOne, ManyToMany, JoinColumn } from "typeorm";

import { App, LinkType, User } from "@domain/entities";

import { BaseSoftDelete } from "../base";

@Entity()
export class Link extends BaseSoftDelete {
    @Column()
    public url: string;

    @Column()
    public ownerId: string;

    @Column({ default: false })
    public showOnProfile: boolean;

    @Column()
    public linkTypeId: string;

    @ManyToOne(() => LinkType, (linkType) => linkType.links)
    @JoinColumn({ name: "linkTypeId" })
    public type: LinkType;

    @ManyToMany(() => App, (app) => app.socialLinks)
    public apps: App[];

    @ManyToOne(() => User, (user) => user.links)
    public owner: User;
}

