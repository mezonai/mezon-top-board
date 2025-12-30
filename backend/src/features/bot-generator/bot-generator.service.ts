import { Injectable } from '@nestjs/common';
import { BotGeneratorJob } from '@features/job/bot-generator.job';
import { BotWizardRequest, GetOwnBotWizardRequest } from '@features/bot-generator/dtos/request';
import { join } from 'path';
import { promises } from 'fs';
import { EntityManager } from 'typeorm';
import { GenericRepository } from '@libs/repository/genericRepository';
import { BotWizard } from '@domain/entities/schema/botWizard.entity';
import { BotWizardStatus } from '@domain/common/enum/botWizardStatus';
import { Result } from '@domain/common/dtos/result.dto';
import { paginate } from '@libs/utils/paginate';
import { Mapper } from '@libs/utils/mapper';
import { GetBotWizardResponse } from '@features/bot-generator/dtos/response';

@Injectable()
export class BotGeneratorService {
  private readonly botWizardRepository: GenericRepository<BotWizard>;

  constructor(
    private readonly botGeneratorJob: BotGeneratorJob,
    private manager: EntityManager,
  ) {
    this.botWizardRepository = new GenericRepository(BotWizard, manager);
  }

  async genBotTemplate(payload: BotWizardRequest, ownerId: string) {
    const botWizard = await this.botWizardRepository.create({
      ownerId,
      botName: payload.botName,
      status: BotWizardStatus.PROCESSING,
      templateJson: payload.templateJson,
    });
    return await this.botGeneratorJob.addToQueue({
      payload,
      ownerId,
      botWizardId: botWizard.id,
    });
  }

  async getIntegrationsList(language: string): Promise<string[]> {
    const integrationsPath = join(process.cwd(), 'bot-gen-templates', language, 'src', 'integrations');

    const folders = await promises.readdir(integrationsPath, { withFileTypes: true });

    const integrations = folders
      .filter((folder) => folder.isDirectory())
      .map((folder) => folder.name);

    return integrations;
  }

  async getLanguagesList(): Promise<string[]> {
    const languagesPath = join(process.cwd(), 'bot-gen-templates');

    const folders = await promises.readdir(languagesPath, { withFileTypes: true });

    const languages = folders
      .filter((folder) => folder.isDirectory())
      .map((folder) => folder.name);

    return languages;
  }

  async getBotWizard(id: string) {
    const botWizard = await this.botWizardRepository.findById(id)
    return new Result({ data: botWizard })
  }

  async getOwnListbotWizards(ownerId: string, query: GetOwnBotWizardRequest) {
    const inValidateSortField = query.sortField === 'name' ? 'botName' : query.sortField;
    return paginate<BotWizard, GetBotWizardResponse>(
      () =>
        this.botWizardRepository.findMany({
          ...query,
          sortField: inValidateSortField,
          where: () => ({ ownerId, status: query.status }),
          relations: ['tempFile'],
        }),
      query.pageSize,
      query.pageNumber,
      (entity) => Mapper(GetBotWizardResponse, entity),
    );
  }
}