import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'

import { CreateMailRequest } from '@features/mail/dtos/request'
import { MailService } from '@features/mail/mail.service'

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post()
  create(
    @Body()
    body: CreateMailRequest,
  ) {
    return this.mailService.createMail(body)
  }

  @Post('/send')
  createAndSendMail(
    @Body()
    body: CreateMailRequest,
  ) {
    return this.mailService.createMailAndSendMail(body)
  }

  @Get('mails')
  getAllMails() {
    return this.mailService.getAllMails()
  }

  @Patch('/:id')
  updateMail(
    @Param('id') id: string,
    @Body() body: Partial<CreateMailRequest>,
  ) {
    return this.mailService.updateMail(id, body)
  }

  @Delete('/:id')
  deleteMail(@Param('id') id: string) {
    return this.mailService.deleteMail(id)
  }
}
