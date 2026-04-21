import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

import { CollectionApp } from "@domain/entities";

import { BaseSoftDelete } from "../base";


import { User } from "./user.entity";

export enum CollectionStatus {
    PRIVATE = "PRIVATE",
    PUBLISHED = "PUBLISHED",
}

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

    @OneToMany(() => CollectionApp, (collectionApp) => collectionApp.collection)
    public collectionApps: CollectionApp[];
}