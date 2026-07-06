import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from "typeorm";

import { CollectionStatus } from "@domain/common/enum/collectionStatus";

import { App } from "./app.entity";
import { BaseSoftDelete } from "../base";
import { User } from "./user.entity";

@Entity({ name: "collection" })
export class Collection extends BaseSoftDelete {
    @Column({ type: "varchar", length: 255 })
    public title: string;

    @Column({ type: "text", nullable: true })
    public description: string | null;

    @Column({ type: "varchar", nullable: true })
    public featuredImage: string | null;

    @Column({
        type: "enum",
        enum: CollectionStatus,
        default: CollectionStatus.PRIVATE,
    })
    public status: CollectionStatus;

    @Column({ type: "uuid" })
    public ownerId: string;

    @ManyToOne(() => User, (user) => user.collections, { onDelete: "CASCADE" })
    @JoinColumn({ name: "ownerId" })
    public owner: User;

    @ManyToMany(() => App, (app) => app.collections)
    @JoinTable()
    public apps: App[];
}