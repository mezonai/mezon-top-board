import { Controller, Get, Post, Param, Body, Res, Patch, Delete } from '@nestjs/common';

import { GetSubscriptionRequest } from '@features/subscribe/dto/request';

import { Public } from '@libs/decorator/authorization.decorator';

import { SubscribeService } from './subscribe.service';


@Controller('subscribe')
export class SubscribeController {
  constructor(private readonly subscribeService: SubscribeService) {}

  @Post('send-confirm-mail')
  sendConfirmMail(@Body('email') email: string) {
    return this.subscribeService.sendMailSubcribe(email);
  }

  @Public()
  @Get('confirm/:token')
  confirmSubscribe(@Param('token') token: string, @Res() res) {
    return this.subscribeService.confirmSubscribe(token, res);
  }

  @Public()
  @Get('unsubscribe/:email')
  unsubscribe(@Param('email') email: string) {
    return this.subscribeService.unsubscribe(email);
  }

  @Get('active-subscribers')
  getAllActiveSubscribers() {
    return this.subscribeService.getAllActiveSubscribers();
  }

  @Get('all-subscribers')
  getAllSubscribers() {
    return this.subscribeService.getAllSubscribers();
  }

  @Post('create-subscriber')
  async create(@Body() body: GetSubscriptionRequest) {
    return this.subscribeService.createSubscriber(body)
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return this.subscribeService.deleteSubscriber(id)
  }

  @Patch('update-preferences')
  updatePreferences(
    @Body('id') id: string,
    @Body() data: Partial<GetSubscriptionRequest>,
  ) {
    return this.subscribeService.updateSubscriptionPreferences(id, data);
  }

}
