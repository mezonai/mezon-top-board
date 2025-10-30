import { Entity, Column, ManyToMany } from "typeorm";

import { App } from "@domain/entities";

import { BaseSoftDelete } from "../base";

@Entity()
export class Tag extends BaseSoftDelete {
    @Column()
    public name: string;

    @Column()
    public slug: string;

    @ManyToMany(() => App, (app) => app.tags)
    public apps: App[];
}
