import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User, App, FavoriteApp } from "@domain/entities";
import { FavoriteAppController } from "./favorite-app.controller";
import { FavoriteAppService } from "./favorite-app.service";

@Module({
    imports: [TypeOrmModule.forFeature([User, App, FavoriteApp])],
    controllers: [FavoriteAppController],
    providers: [FavoriteAppService],
    exports: [FavoriteAppService],
})
export class FavoriteAppModule { }