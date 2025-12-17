import { tempFilesRootDir } from '@config/files.config';
import { Result } from '@domain/common/dtos/result.dto';
import { BotWizardStatus } from '@domain/common/enum/botWizardStatus';
import { SaveTempFileArgs } from '@domain/common/types/temp-file.types';
import { TempFile } from '@domain/entities';
import { BotWizard } from '@domain/entities/schema/botWizard.entity';
import { GetOwnTempFileRequest, GetTempFileRequest } from '@features/temp-storage/dtos/request';
import { GetTempFileResponse } from '@features/temp-storage/dtos/response';
import { GenericRepository } from '@libs/repository/genericRepository';
import { Mapper } from '@libs/utils/mapper';
import { paginate } from '@libs/utils/paginate';
import { BadRequestException, Injectable } from '@nestjs/common';
import { promises, existsSync, mkdirSync } from 'fs';
import * as moment from 'moment';
import { join } from 'path';
import { EntityManager } from 'typeorm';

@Injectable()
export class TempStorageService {
  private readonly tempFileRepository: GenericRepository<TempFile>;
  private readonly botWizardRepository: GenericRepository<BotWizard>;
  private readonly DEFAULT_EXPIRED_HOURS = 24;

  constructor(
    private manager: EntityManager,
  ) {
    this.tempFileRepository = new GenericRepository(TempFile, manager);
    this.botWizardRepository = new GenericRepository(BotWizard, manager);
  }

  async saveTemp(saveTempFileArgs: SaveTempFileArgs, ownerId: string, botWizardId: string) {
    let tempFile = await this.tempFileRepository.getRepository().create({
      fileName: saveTempFileArgs.fileName,
      ownerId,
      botWizardId,
    })

    if (saveTempFileArgs.id) {
      tempFile = await this.tempFileRepository.findById(saveTempFileArgs.id);
      if (!tempFile) throw new BadRequestException(`Temp file not found`);

      tempFile.fileName = saveTempFileArgs.fileName;

      if (botWizardId) {
        tempFile.botWizardId = botWizardId;
      }
    }

    tempFile.mimeType = saveTempFileArgs.mimeType;
    tempFile.expiredAt = moment().add(saveTempFileArgs.expiredHours || this.DEFAULT_EXPIRED_HOURS, 'hours').toDate();

    const absoluteDir = join(tempFilesRootDir, saveTempFileArgs.path || '');

    if (!existsSync(absoluteDir)) {
      mkdirSync(absoluteDir, { recursive: true });
    }

    const relativeFilePath = `${saveTempFileArgs.path || ''}/${saveTempFileArgs.fileName}`;
    const normalizedPath = relativeFilePath.replace(/^\/+/, '');
    const absoluteFilePath = join(tempFilesRootDir, normalizedPath);
    await promises.writeFile(absoluteFilePath, saveTempFileArgs.buffer);

    tempFile.filePath = normalizedPath;

    await this.tempFileRepository.getRepository().save(tempFile);

    return await this.botWizardRepository.update(botWizardId, { status: BotWizardStatus.COMPLETED });
  }

  async getTempFile(id: string) {
    const tempFile = await this.tempFileRepository.findById(id)
    return new Result({ data: tempFile })
  }

  async getListTempFiles(query: GetTempFileRequest) {
    const inValidateSortField = query.sortField === 'name' ? 'fileName' : query.sortField;
    const ownerFilter = query.ownerId ? { ownerId: query.ownerId } : {};
    return paginate<TempFile, GetTempFileResponse>(
      () =>
        this.tempFileRepository.findMany({
          ...query,
          sortField: inValidateSortField,
          where: () => ownerFilter
        }),
      query.pageSize,
      query.pageNumber,
      (entity) => Mapper(GetTempFileResponse, entity),
    );
  }

  async getOwnListTempFiles(ownerId: string, query: GetOwnTempFileRequest) {
    const inValidateSortField = query.sortField === 'name' ? 'fileName' : query.sortField;
    return paginate<TempFile, GetTempFileResponse>(
      () =>
        this.tempFileRepository.findMany({
          ...query,
          sortField: inValidateSortField,
          where: () => ({ ownerId })
        }),
      query.pageSize,
      query.pageNumber,
      (entity) => Mapper(GetTempFileResponse, entity),
    );
  }
}