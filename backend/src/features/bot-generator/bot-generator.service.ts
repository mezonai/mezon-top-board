import { Injectable } from '@nestjs/common';
import { BotGeneratorJob } from '@features/job/bot-generator.job';
import { BotWizardRequest } from '@features/bot-generator/dtos/request';

@Injectable()
export class BotGeneratorService {
  constructor(private readonly botGeneratorJob: BotGeneratorJob,) {}

  async genBotTemplate(payload: BotWizardRequest, ownerId: string) {
    return await this.botGeneratorJob.addToQueue({ payload, ownerId });
  }
}