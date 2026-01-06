import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import { App, BaseSoftDelete, User } from "@domain/entities";

@Entity("favorite_app")
@Unique(["userId", "appId"]) 
export class FavoriteApp extends BaseSoftDelete {
    @Column()
    userId: string;

    @Column()
    appId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: "userId" })
    user: User;

    @ManyToOne(() => App)
    @JoinColumn({ name: "appId" })
    app: App;
}