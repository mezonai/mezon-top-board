import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { App, Rating, User } from "@domain/entities";

import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
    imports: [TypeOrmModule.forFeature([User, App, Rating])],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService],
})
export class UserModule { }
