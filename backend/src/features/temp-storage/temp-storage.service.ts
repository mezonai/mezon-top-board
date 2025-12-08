import { Result } from '@domain/common/dtos/result.dto';
import { SaveTempFileArgs } from '@domain/common/types/temp-file.types';
import { TempFile } from '@domain/entities';
import { GetOwnTempFileRequest, GetTempFileRequest } from '@features/temp-storage/dtos/request';
import { GetTempFileResponse } from '@features/temp-storage/dtos/response';
import { GenericRepository } from '@libs/repository/genericRepository';
import { Mapper } from '@libs/utils/mapper';
import { paginate } from '@libs/utils/paginate';
import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import moment from 'moment';
import {join} from 'path';
import { EntityManager } from 'typeorm';

@Injectable()
export class TempStorageService {
  private readonly tempFileRepository: GenericRepository<TempFile>;
  private readonly DEFAULT_EXPIRED_HOURS = 24;

  constructor(
    private manager: EntityManager,
  ) {
    this.tempFileRepository = new GenericRepository(TempFile, manager);
  }

  async saveTemp(saveTempFileArgs: SaveTempFileArgs) {
    let tempFile = await this.tempFileRepository.getRepository().create({
      fileName: saveTempFileArgs.fileName,
    })

    if (saveTempFileArgs.id) {
      tempFile = await this.tempFileRepository.findById(saveTempFileArgs.id);
      if (!tempFile) throw new BadRequestException(`Temp file not found`);

      tempFile.fileName = saveTempFileArgs.fileName;
    }

    tempFile.mimeType = saveTempFileArgs.mimeType;
    tempFile.expiredAt = moment().add(saveTempFileArgs.expiredHours || this.DEFAULT_EXPIRED_HOURS, 'hours').toDate();

    const finalPath = join(saveTempFileArgs.path || '', saveTempFileArgs.fileName);
    if (!fs.existsSync(finalPath)) {
      fs.mkdirSync(finalPath, { recursive: true });
    }

    await fs.writeFile(finalPath, saveTempFileArgs.buffer, (err) => {
      if (err) {
        throw new BadRequestException(`Error saving temp file: ${err.message}`);
      }
    });

    tempFile.filePath = finalPath;

    return await this.tempFileRepository.getRepository().save(tempFile);
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