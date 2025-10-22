import { Controller, Get, Post, Param, Body, Res, Patch, Delete, Query } from '@nestjs/common';

import { Role } from '@domain/common/enum/role';

import { GetEmailSubscriptionRequest, SearchEmailSubscriberRequest } from '@features/email-subscribe/dto/request';

import { Public } from '@libs/decorator/authorization.decorator';
import { RoleRequired } from '@libs/decorator/roles.decorator';

import { EmailSubscribeService } from './email-subscribe.service';

@Controller('email-subscribe')
export class EmailSubscribeController {
  constructor(private readonly subscribeService: EmailSubscribeService) { }

  @Post()
  sendConfirmMail(@Body('email') email: string) {
    return this.subscribeService.sendMailSubcribe(email);
  }

  @Get('confirm/:token')
  confirmSubscribe(@Param('token') token: string, @Res() res) {
    return this.subscribeService.confirmSubscribe(token, res);
  }

  @Public()
  @Get('unsubscribe/:email')
  unsubscribe(@Param('email') email: string, @Res() res) {
    return this.subscribeService.unsubscribe(email, res);
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

  @Delete('/:id')
  @RoleRequired([Role.ADMIN])
  async delete(@Param('id') id: string) {
    return this.subscribeService.deleteSubscriber(id)
  }

  @Patch('/:id')
  @RoleRequired([Role.ADMIN])
  updatePreferences(
    @Param('id') id: string,
    @Body() data: Partial<GetEmailSubscriptionRequest>,
  ) {
    return this.subscribeService.updateSubscriptionPreferences(id, data);
  }

}
