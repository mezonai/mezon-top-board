import envConfig from '@config/env.config';
import { RequestWithId } from '@domain/common/dtos/request.dto';
import { Result } from '@domain/common/dtos/result.dto';
import { TempFile } from '@domain/entities';
import { GetOwnTempFileRequest, GetTempFileRequest } from '@features/temp-storage/dtos/request';
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

  //Implement in job queue later
  async saveTemp(id: string | null, buffer: Buffer) {
    let tempFile;

    if (id) {
      tempFile = await this.tempFileRepository.findById(id);
      if (!tempFile) throw new BadRequestException('Temp file not found');
    } else {
      tempFile = await this.tempFileRepository.create({
        fileName: `bot-template-${Date.now()}.zip`,
      });

      id = tempFile.id;
    }

    const dirPath = path.join(process.cwd(), envConfig().TEMP_FILE_DIR, envConfig().BOT_GENERATED_FILE_DIR);

    const filePath = path.join(dirPath, tempFile.fileName);

    await fs.mkdirp(dirPath);
    await fs.writeFile(filePath, buffer);

    return await this.tempFileRepository.update(id, {
      filePath: `/${envConfig().BOT_GENERATED_FILE_DIR}/${tempFile.fileName}`,
      mimeType: 'application/zip',
      expiredAt: new Date(),
    });
  }

  async getTempFile(query: RequestWithId) {
    const tempFile = await this.tempFileRepository.findById(query.id)
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