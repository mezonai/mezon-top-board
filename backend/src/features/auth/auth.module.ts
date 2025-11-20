import { Module } from "@nestjs/common";

import { User } from "@domain/entities";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtStrategy } from "@libs/guard/jwt.strategy";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { OAuth2Service } from "./oauth2.service";
import { UserModule } from "@features/user/user.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({}),
    PassportModule,
    UserModule,
  ],
  providers: [AuthService, JwtStrategy, OAuth2Service],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule { }
