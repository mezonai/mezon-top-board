import { Body, Controller, Get, Post, Query, Req, Res } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";

import { Logger } from "@libs/logger";

import { Public } from "@libs/decorator/authorization.decorator";
import { AuthService } from "./auth.service";
import { BasicAuthRequest, OAuth2Request, RefreshTokenDto } from "./dtos/request";

import config from "@config/env.config";

@Controller("auth")
@ApiTags("Auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: Logger,
  ) {
    this.logger.setContext(AuthController.name);
  }

  @Public()
  @Get("redirect")
  async redirect(@Req() req, @Res() res) {
    const OAUTH2_API_URL = config().OAUTH2_API_URL || ''
    const CLIENT_ID = config().OAUTH2_CLIENT_ID
    const REDIRECT_URI = config().OAUTH2_REDIRECT_URI || ''
    const STATE = Math.random().toString(36).substring(2, 15)

    const authUrl = `${OAUTH2_API_URL}/oauth2/auth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=openid&state=${STATE}`
    return res.redirect(authUrl);
  }

  @Public()
  @Post("basic")
  async loginBasic(@Body() body: BasicAuthRequest) {
    return await this.authService.loginByBasicAuth(body);
  }

  @Public()
  @Post("verify-oauth2")
  @ApiBody({ type: OAuth2Request })
  async verifyOAuth2(@Body() body: OAuth2Request) {
    return await this.authService.verifyOAuth2(body);
  }

  @Public()
  @Post("refresh-token")
  @ApiBody({ type: RefreshTokenDto })
  @ApiOperation({
    summary: "Get new access token and refresh token",
  })
  async refreshAccessToken(@Body() { refreshToken }: RefreshTokenDto) {
    return await this.authService.verifyRefreshToken(refreshToken);
  }
}
