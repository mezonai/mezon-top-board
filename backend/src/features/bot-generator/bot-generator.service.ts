import { Injectable } from '@nestjs/common';
import { BotGeneratorJob } from '@features/job/bot-generator.job';
import { BotWizardRequest, GetBotWizardRequest, GetOwnBotWizardRequest } from '@features/bot-generator/dtos/request';
import { join } from 'path';
import { promises } from 'fs';
import { Brackets, EntityManager } from 'typeorm';
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

  private async buildSearchQuery(
    query: GetBotWizardRequest,
    ownerCondition?: { ownerId: string },
  ) {
    const skip = (query.pageNumber - 1) * query.pageSize;
    const take = query.pageSize;

    const qb = this.botWizardRepository
      .getRepository()
      .createQueryBuilder('botWizard')
      .select('botWizard.id')
      .skip(skip)
      .take(take);

    if (ownerCondition) {
      qb.andWhere('botWizard.ownerId = :ownerId', ownerCondition);
    } else if (query.ownerId) {
      qb.andWhere('botWizard.ownerId = :ownerId', { ownerId: query.ownerId });
    }

    if (query.botName) {
      qb.andWhere(
        'botWizard.botName ILIKE :botName',
        { botName: `%${query.botName}%` },
      );
    }

    if (query.language) {
      qb.andWhere(
        'botWizard.language = :language',
        { language: query.language },
      );
    }

    if (query.status) {
      qb.andWhere(
        'botWizard.status = :status',
        { status: query.status },
      );
    }

    const sortField =
      query.sortField === 'name' ? 'botName' : query.sortField || 'createdAt';
    const sortOrder = query.sortOrder || 'DESC';

    qb.orderBy(`botWizard.${sortField}`, sortOrder as 'ASC' | 'DESC');

    const [ids, total] = await qb.getManyAndCount();

    const botWizardList = this.botWizardRepository
      .getRepository()
      .createQueryBuilder('botWizard')
      .leftJoinAndSelect('botWizard.tempFile', 'tempFile')
      .where('botWizard.id IN (:...ids)', {
        ids: ids.length ? ids.map(i => i.id) : ['00000000-0000-0000-0000-000000000000'],
      })
      .orderBy(`botWizard.${sortField}`, sortOrder as 'ASC' | 'DESC');

    return { botWizardList, total };
  }

  async getListbotWizards(query: GetBotWizardRequest) {
    const { botWizardList, total } = await this.buildSearchQuery(query);

    const data = await botWizardList.getMany();

    return paginate<BotWizard, GetBotWizardResponse>(
      [data, total],
      query.pageSize,
      query.pageNumber,
      (entity) => Mapper(GetBotWizardResponse, entity),
    );
  }

  async getOwnListbotWizards(ownerId: string, query: GetOwnBotWizardRequest) {
    const { botWizardList, total } = await this.buildSearchQuery(query, { ownerId });

    const data = await botWizardList.getMany();

    return paginate<BotWizard, GetBotWizardResponse>(
      [data, total],
      query.pageSize,
      query.pageNumber,
      (entity) => Mapper(GetBotWizardResponse, entity),
    );
  }
}