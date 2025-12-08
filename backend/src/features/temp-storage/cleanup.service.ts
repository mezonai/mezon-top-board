import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as fs from 'fs';
import { join } from 'path';
import { tempFilesRootDir } from '@config/files.config';
import { EntityManager, LessThan } from 'typeorm';
import { GenericRepository } from '@libs/repository/genericRepository';
import { TempFile } from '@domain/entities';

@Injectable()
export class CleanupTempFileService {
  private readonly logger = new Logger(CleanupTempFileService.name);
  private readonly tempFileRepository: GenericRepository<TempFile>;

  constructor(
    private manager: EntityManager,
  ) {
    this.tempFileRepository = new GenericRepository(TempFile, manager);
  }

  @Cron('0 */6 * * *')
  async cleanupTempFiles() {
    const now = new Date();

    const expiredFiles = await this.tempFileRepository.find({
      where: { expiredAt: LessThan(now) },
    });

    for (const file of expiredFiles) {
      try {
        if (file.filePath) {
          const absolutePath = join(tempFilesRootDir, file.filePath);

          if (fs.existsSync(absolutePath)) {
            fs.rmSync(absolutePath, { recursive: true, force: true });
            this.logger.log(`Deleted temp: ${file.filePath}`);
          }
        }

        await this.tempFileRepository.delete(file.id);
      } catch (err) {
        this.logger.error(`Failed to delete temp ${file.id}`, err);
      }
    }
  }
}
