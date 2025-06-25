import { Entity, Column, OneToMany } from "typeorm";

import { Link } from "@domain/entities";

import { BaseSoftDelete } from "../base";

@Entity()
export class LinkType extends BaseSoftDelete {
    @Column()
    public name: string;

    @Column({ default: '' })
    public prefixUrl: string;

    @Column()
    public icon: string;

    @OneToMany(() => Link, (link) => link.type)
    links: Link[];
}
