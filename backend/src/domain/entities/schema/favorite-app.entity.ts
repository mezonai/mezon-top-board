import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { App, User } from "@domain/entities";

@Entity("favorite_apps")
export class FavoriteApp {
    @PrimaryColumn()
    userId: string;

    @PrimaryColumn()
    appId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: "userId" })
    user: User;

    @ManyToOne(() => App)
    @JoinColumn({ name: "appId" })
    app: App;
}