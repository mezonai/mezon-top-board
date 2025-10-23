import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { Role } from '@domain/common/enum/role'

import { CreateMailTemplateRequest, SearchMailTemplateRequest } from '@features/marketing-mail/dtos/request'
import { MailTemplateService } from '@features/marketing-mail/marketing-mail.service'

import { RoleRequired } from '@libs/decorator/roles.decorator'

@Controller('mail-template')
@ApiTags('Mail Template')
export class MailTemplateController {
  constructor(private readonly mailService: MailTemplateService) { }

  @Post()
  @RoleRequired([Role.ADMIN])
  createMail(
    @Body()
    body: CreateMailTemplateRequest,
  ) {
    return this.mailService.createMail(body)
  }

  @Get()
  @RoleRequired([Role.ADMIN])
  getAllMails() {
    return this.mailService.getAllMails()
  }

  @Get('search')
  @RoleRequired([Role.ADMIN])
  getMailsSearch(@Query() query: SearchMailTemplateRequest) {
    try {
      return this.mailService.getMailsSearch(query)
    } catch (error) {
      console.error("An error occured", error);
      throw error;
    }
  }

  @Get('/:id')
  @RoleRequired([Role.ADMIN])
  getOneMail(@Param('id') id: string) {
    return this.mailService.getOneMail(id)
  }

  @Patch('/:id')
  @RoleRequired([Role.ADMIN])
  updateMail(
    @Param('id') id: string,
    @Body() body: Partial<CreateMailTemplateRequest>,
  ) {
    return this.mailService.updateMail(id, body)
  }

  @Delete('/:id')
  @RoleRequired([Role.ADMIN])
  deleteMail(@Param('id') id: string) {
    return this.mailService.deleteMail(id)
  }
}
