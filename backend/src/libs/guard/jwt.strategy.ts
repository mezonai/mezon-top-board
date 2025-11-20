import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

import { isEmail } from "class-validator";
import * as moment from "moment";
import { ExtractJwt, Strategy } from "passport-jwt";

import config from "@config/env.config";

import { AuthService } from "@features/auth/auth.service";

import { ErrorMessages } from "@libs/constant/messages";
import { JwtPayload, ValidateJwtRequest } from "@libs/guard/jwt.types";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: config().JWT_ACCESS_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(request: ValidateJwtRequest, payload: JwtPayload) {
    const { email, expireTime, sessionToken } = payload;

    if (!isEmail(email)) {
      throw new UnauthorizedException(ErrorMessages.INVALID_EMAIL);
    }

    const user = await this.authService.findUserByEmail(email, false);
    if (!user) {
      throw new UnauthorizedException(ErrorMessages.NOT_FOUND_MSG);
    }

    const now = moment();
    const expireDate = moment(expireTime);

    if (!expireDate.isValid() || now.isAfter(expireDate)) {
      throw new UnauthorizedException(ErrorMessages.TOKEN_EXPIRED);
    }

    request.sessionToken = sessionToken;
    return user;
  }
}
