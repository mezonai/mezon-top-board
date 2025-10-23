import { Controller, Get, Post, Param, Body, Patch, Delete, Query } from '@nestjs/common';
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

  @Get('confirm/:email')
  confirmSubscribe(@Param('email') email: string) {
    return this.subscribeService.confirmSubscribe(email);
  }

  @Get('unsubscribe/:email')
  unsubscribe(@Param('email') email: string) {
    return this.subscribeService.unsubscribe(email);
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
