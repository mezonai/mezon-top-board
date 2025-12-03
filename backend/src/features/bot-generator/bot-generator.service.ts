import { BadRequestException, Injectable } from '@nestjs/common';
import { GenericRepository } from '@libs/repository/genericRepository';
import { TempSourceFile } from '@domain/entities';
import { EntityManager } from 'typeorm';
import { TempSourceFileStatus } from '@domain/common/enum/tempSourceFileStatus';
import { BotGeneratorJob } from '@features/job/bot-generator.job';

@Injectable()
export class BotGeneratorService {
  private readonly tempSourceFileRepository: GenericRepository<TempSourceFile>;
  constructor(
    private manager: EntityManager,
    private readonly job: BotGeneratorJob,
  ) {
    this.tempSourceFileRepository = new GenericRepository(TempSourceFile, manager);
  }

  async createJob(payload: any, ownerId: string) {
    const temp = this.tempSourceFileRepository.getRepository().create({
      fileName: `${payload.botName}-${Date.now()}.zip`,
      status: TempSourceFileStatus.PROCESSING,
      ownerId,
    });

    await this.tempSourceFileRepository.getRepository().save(temp);

    await this.job.addToQueue({
      tempFileId: temp.id,
      payload,
    });

    return temp;
  }

  async getListByOwner(ownerId: string) {
    return await this.tempSourceFileRepository.find({
      where: { ownerId },
      order: { createdAt: 'DESC' },
    });
  }

  async getfilePathById(id: string, ownerId: string) {
    const temp = await this.tempSourceFileRepository.findOne({
      where: { id, ownerId, status: TempSourceFileStatus.COMPLETED },
    });
    return temp.filePath;
  }
}
