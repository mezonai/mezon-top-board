import { Injectable } from '@nestjs/common';
import { BotGeneratorJob } from '@features/job/bot-generator.job';
import { BotWizardRequest } from '@features/bot-generator/dtos/request';
import { join } from 'path';
import { promises } from 'fs';

@Injectable()
export class BotGeneratorService {
  constructor(private readonly botGeneratorJob: BotGeneratorJob,) { }

  async genBotTemplate(payload: BotWizardRequest, ownerId: string) {
    return await this.botGeneratorJob.addToQueue({ payload, ownerId });
  }

  async getIntegrationsList(language: string): Promise<string[]> {
    const integrationsPath = join(process.cwd(), 'bot-gen-templates', language, 'src', 'integrations');

    const folders = await promises.readdir(integrationsPath, { withFileTypes: true });

    const integrations = folders
      .filter((folder) => folder.isDirectory())
      .map((folder) => folder.name);

    return integrations;
  }
}