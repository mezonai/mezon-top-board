import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

import { Collection } from "@domain/entities";

import { App } from "./app.entity";

@Entity({ name: "collection_app" })
export class CollectionApp {
    @PrimaryColumn({ type: "uuid" })
    public collectionId: string;

    @PrimaryColumn({ type: "uuid" })
    public appId: string;

    @Column({ type: "integer", default: 0 })
    public order: number;

    @ManyToOne(() => Collection, (collection) => collection.collectionApps, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "collectionId" })
    public collection: Collection;

    @ManyToOne(() => App, (app) => app.collectionApps, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "appId" })
    public app: App;
}
