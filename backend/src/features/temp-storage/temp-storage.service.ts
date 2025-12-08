import envConfig from '@config/env.config';
import { RequestWithId } from '@domain/common/dtos/request.dto';
import { Result } from '@domain/common/dtos/result.dto';
import { TempFile } from '@domain/entities';
import { GetOwnTempFileRequest, GetTempFileRequest, SaveTempFileRequest } from '@features/temp-storage/dtos/request';
import { GetTempFileResponse } from '@features/temp-storage/dtos/response';
import { GenericRepository } from '@libs/repository/genericRepository';
import { Mapper } from '@libs/utils/mapper';
import { paginate } from '@libs/utils/paginate';
import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as path from 'path';
import { EntityManager } from 'typeorm';

@Injectable()
export class TempStorageService {
  private readonly tempFileRepository: GenericRepository<TempFile>;

  constructor(
    private manager: EntityManager,
  ) {
    this.tempFileRepository = new GenericRepository(TempFile, manager);
  }

  async saveTemp(saveTempFileRequest: SaveTempFileRequest) {
    let tempFile;

    if (!saveTempFileRequest.id) {
      tempFile = await this.tempFileRepository.getRepository().create({
        fileName: saveTempFileRequest.fileName,
        mimeType: saveTempFileRequest.mimeType,
        expiredAt: new Date(Date.now() + 24 * 3600 * 1000),
      });
      saveTempFileRequest.id = tempFile.id;
    } else {
      tempFile = await this.tempFileRepository.findById(saveTempFileRequest.id);
      if (!tempFile) throw new BadRequestException('Temp file not found');

      tempFile.fileName = saveTempFileRequest.fileName;
      tempFile.mimeType = saveTempFileRequest.mimeType;
      tempFile.expiredAt = new Date(Date.now() + 24 * 3600 * 1000);
    }

    const finalPath = path.join(saveTempFileRequest.dir, saveTempFileRequest.fileName);
    await fs.mkdirp(saveTempFileRequest.dir);

    await fs.writeFile(finalPath, saveTempFileRequest.buffer);

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