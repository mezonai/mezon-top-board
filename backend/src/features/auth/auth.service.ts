import config from "@config/env.config";
import { Result } from "@domain/common/dtos/result.dto";
import { Role } from "@domain/common/enum/role";
import { User } from "@domain/entities";
import { ErrorMessages } from "@libs/constant/messages";
import { JwtPayload } from "@libs/guard/jwt.types";
import { GenericRepository } from "@libs/repository/genericRepository";
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { isEmail } from "class-validator";
import * as crypto from "crypto";
import * as moment from "moment";
import { EntityManager } from "typeorm";
import { BasicAuthRequest, OAuth2Request } from "./dtos/request";
import { OAuth2Service } from "./oauth2.service";
import { OAuth2TokenResponse, OAuth2UserInfoResponse } from "./types/OAuth2.types";

@Injectable()
export class AuthService {
  private readonly userRepository: GenericRepository<User>;
  constructor(
    private manager: EntityManager,
    private readonly jwtService: JwtService,
    private readonly oauth2Service: OAuth2Service,
  ) {
    this.userRepository = new GenericRepository(User, manager);
  }

  async verifyOAuth2(payload: OAuth2Request): Promise<Result> {
    try {
      const data: OAuth2TokenResponse = await this.oauth2Service.getOAuth2Token(payload);

      const oryInfo: OAuth2UserInfoResponse = await this.oauth2Service.decodeORYTokenOAuth2(
        data.access_token,
      );

      if (!isEmail(oryInfo.sub)) {
        throw new BadRequestException(ErrorMessages.INVALID_EMAIL);
      }

      const user = await this.findUserByEmail(oryInfo.sub);

      if (user) {
        if (user.willSyncFromMezon) {
          await this.userRepository.update(user.id, {
            name: oryInfo.display_name || oryInfo.username || oryInfo.sub.split('@')[0],
            profileImage: oryInfo.avatar,
            willSyncFromMezon: false,
          });
        }

        const tokens = await this.generateAccessAndRefreshTokens(user);
        return new Result({ data: tokens });
      }

      const newUser = await this.userRepository.create({
        email: oryInfo.sub,
        name: oryInfo.display_name || oryInfo.username || oryInfo.sub.split('@')[0],
        profileImage: oryInfo.avatar,
        role: Role.DEVELOPER,
      });
      const tokens = await this.generateAccessAndRefreshTokens(newUser);
      return new Result({ data: tokens });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException();
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          email: email,
        },
        withDeleted: false,
      });
      return user;
    } catch {
      return;
    }
  }

  async generateAccessAndRefreshTokens(
    user: User,
    providedSessionToken?: string,
  ) {
    const { email } = user;
    const {
      JWT_ACCESS_TOKEN_SECRET: jwtSecret,
      JWT_REFRESH_TOKEN_SECRET: refreshSecret,
      JWT_ACCESS_TOKEN_EXPIRES_IN_MINUTES: accessTokenExpiration,
      JWT_REFRESH_TOKEN_EXPIRES_IN_MINUTES: refreshTokenExpiration,
    } = config();

    const sessionToken = providedSessionToken ?? crypto.randomBytes(5).toString("hex");

    const expireTime = moment().add(accessTokenExpiration, "minutes").toDate();
    const refreshTokenExpireTime = moment()
      .add(refreshTokenExpiration, "minutes")
      .toDate();

    const accessToken = this.jwtService.sign(
      { email, sessionToken, expireTime },
      {
        secret: jwtSecret,
      },
    );

    const refreshToken = this.jwtService.sign(
      { email, sessionToken, expireTime: refreshTokenExpireTime },
      {
        secret: refreshSecret,
      },
    );
    return { accessToken, refreshToken };
  }

  async verifyRefreshToken(refreshToken: string) {
    try {
      const payload: JwtPayload = this.jwtService.verify(refreshToken, {
        secret: config().JWT_REFRESH_TOKEN_SECRET,
      });

      const { sessionToken, email, expireTime } = payload;

      if (!isEmail(email)) {
        throw new UnauthorizedException(ErrorMessages.INVALID_EMAIL);
      }

      const user = await this.findUserByEmail(email);

      if (!user) {
        throw new UnauthorizedException(ErrorMessages.NOT_FOUND_MSG);
      }

      const now = moment();
      const expireDate = moment(expireTime);

      if (!expireTime || !expireDate.isValid() || now.isAfter(expireDate)) {
        throw new ForbiddenException(ErrorMessages.TOKEN_EXPIRED);
      }

      const tokens = await this.generateAccessAndRefreshTokens(
        user,
        sessionToken,
      );

      return new Result({ data: tokens });
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }

      throw new BadRequestException();
    }
  }

  async loginByBasicAuth(data: BasicAuthRequest) {
    const { email, password } = data;

    const user = await this.userRepository.findOne({
      where: {
        email,
      },
      withDeleted: false,
    });

    if (!user) {
      throw new UnauthorizedException(ErrorMessages.INVALID_EMAIL);
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new UnauthorizedException(ErrorMessages.INVALID_PASSWORD);
    }

    const tokens = await this.generateAccessAndRefreshTokens(user);

    return new Result({ data: tokens });
  }
}
