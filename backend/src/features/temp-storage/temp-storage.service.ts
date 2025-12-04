import { RequestWithId } from '@domain/common/dtos/request.dto';
import { Result } from '@domain/common/dtos/result.dto';
import { TempSourceFileStatus } from '@domain/common/enum/tempSourceFileStatus';
import { TempSourceFile } from '@domain/entities';
import { GetTempSourceFileRequest } from '@features/temp-storage/dtos/request';
import { GetTempSourceFileResponse } from '@features/temp-storage/dtos/response';
import { GenericRepository } from '@libs/repository/genericRepository';
import { Mapper } from '@libs/utils/mapper';
import { paginate } from '@libs/utils/paginate';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as fs from 'fs-extra';
import * as path from 'path';
import { EntityManager } from 'typeorm';

@Injectable()
export class TempStorageService {
  private readonly tempSourceFileRepository: GenericRepository<TempSourceFile>;

  constructor(
    private manager: EntityManager,
  ) {
    this.tempSourceFileRepository = new GenericRepository(TempSourceFile, manager);
  }

  //Implement in job queue later
  async saveTemp(id: string, zipBuffer: Buffer) {
    const tempFile = await this.tempSourceFileRepository.findById(id);
    if (!tempFile) throw new BadRequestException('Temp source file not found');

    const filePath = path.join('/tmp/bot-source-files', id, tempFile.fileName);
    await fs.writeFile(filePath, zipBuffer);

    return await this.tempSourceFileRepository.update(id, {
      filePath,
      status: TempSourceFileStatus.COMPLETED,
      completedAt: new Date(),
    });
  }

  async getTempFile(query: RequestWithId) {
    const tempFile = await this.tempSourceFileRepository.findById(query.id)
    return new Result({ data: tempFile })
  }

  async getListTempFiles(query: GetTempSourceFileRequest) {
    const inValidateSortField = query.sortField === 'name' ? 'fileName' : query.sortField;
    const ownerFilter = query.ownerId ? { ownerId: query.ownerId } : {};
    return paginate<TempSourceFile, GetTempSourceFileResponse>(
      () =>
        this.tempSourceFileRepository.findMany({
          ...query,
          sortField: inValidateSortField,
          where: () => ownerFilter
        }),
      query.pageSize,
      query.pageNumber,
      (entity) => Mapper(GetTempSourceFileResponse, entity),
    );
  }
}