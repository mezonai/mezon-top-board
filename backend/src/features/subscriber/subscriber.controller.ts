import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { SubscriberService } from "./subscriber.service";
import { Logger } from "@libs/logger";
import { Public } from "@libs/decorator/authorization.decorator";
import { SearchSubscriberRequest, SubscribeRequest, UnsubscribeRequest } from "./dtos/request";
import { ApiBearerAuth, ApiBody, ApiResponse } from "@nestjs/swagger";
import { SubscribeResponse, SubscriberResponse, UnsubscribeResponse } from "./dtos/response";
import { RoleRequired } from "@libs/decorator/roles.decorator";
import { Role } from "@domain/common/enum/role";

@Controller("subscriber")
export class SubscriberController {
  constructor(
    private readonly subscriberService: SubscriberService,
    private readonly logger: Logger,
  ) {
    this.logger.setContext(SubscriberController.name);
  }
  @Public()
  @Post('subscribe')
  @ApiBody({ type: SubscribeRequest })
  @ApiResponse({ type: SubscribeResponse })
  async subscribe(@Body() body: SubscribeRequest) {
    try {
      return await this.subscriberService.subscribe(body);
    } catch (error) {
      this.logger.error('Subscribe failed', error);
      throw error;
    }
  }


  @ApiBearerAuth()
  @RoleRequired([Role.ADMIN])
  @Get("search")
  @ApiResponse({ type: SubscriberResponse, isArray: true })
  async getAll(@Query() query: SearchSubscriberRequest) {
    try {
      return await this.subscriberService.getAll(query);
    } catch (error) {
      this.logger.error('Get subscriber list failed', error);
      throw error;
    }
  }
  @Public()
  @Post('confirm-email')
  async confirmEmail(@Body() body: { token: string }) {
    return this.subscriberService.confirmEmail(body.token);
}
}
