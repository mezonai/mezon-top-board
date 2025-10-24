import { Controller, Get, Post, Param, Body, Patch, Delete, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Role } from '@domain/common/enum/role';

import { GetEmailSubscriptionRequest, SearchEmailSubscriberRequest } from '@features/email-subscribe/dto/request';

import { RoleRequired } from '@libs/decorator/roles.decorator';

import { EmailSubscribeService } from './email-subscribe.service';

@Controller('email-subscribe')
@ApiTags("Email Subscribe")
export class EmailSubscribeController {
  constructor(private readonly subscribeService: EmailSubscribeService) { }

  @Post()
  sendConfirmMail(@Body('email') email: string) {
    return this.subscribeService.sendMailSubcribe(email);
  }

  @Get('confirm')
  confirmSubscribe(@Req() req) {
    return this.subscribeService.confirmSubscribe(req.user.email);
  }

  @Get('unsubscribe')
  unsubscribe(@Req() req) {
    return this.subscribeService.unsubscribe(req.user.email);
  }

  @Get()
  @RoleRequired([Role.ADMIN])
  getAllSubscribers() {
    return this.subscribeService.getAllSubscribers();
  }

  @Get("search")
  @RoleRequired([Role.ADMIN])
  searchSubscriber(@Query() query: SearchEmailSubscriberRequest) {
    try {
      return this.subscribeService.searchSubscriber(query);
    } catch (error) {
      console.error("An error occured", error);
      throw error;
    }
  }

  @Patch('resubscribe')
  reSubscribe(
    @Req() req,
    @Body() data: Partial<GetEmailSubscriptionRequest>,
  ) {
    return this.subscribeService.reSubscribe(req.user.email, data);
  }

  @Patch('/:id')
  @RoleRequired([Role.ADMIN])
  updateSubscriber(
    @Param('id') id: string,
    @Body() data: Partial<GetEmailSubscriptionRequest>,
  ) {
    return this.subscribeService.updateSubscriber(id, data);
  }

  @Delete('/:id')
  @RoleRequired([Role.ADMIN])
  async delete(@Param('id') id: string) {
    return this.subscribeService.deleteSubscriber(id)
  }
}
