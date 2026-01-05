import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User, App, UserFavorite } from "@domain/entities"; 
import { FavoriteController } from "./favorite.controller";
import { FavoriteService } from "./favorite.service";

@Module({
    imports: [TypeOrmModule.forFeature([User, App, UserFavorite])], 
    controllers: [FavoriteController],
    providers: [FavoriteService],
    exports: [FavoriteService],
})
export class FavoriteModule {}