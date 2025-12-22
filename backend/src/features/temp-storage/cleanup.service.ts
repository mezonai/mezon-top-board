import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { rmSync, existsSync } from 'fs';
import { join } from 'path';
import { tempFilesRootDir } from '@config/files.config';
import { Between, EntityManager } from 'typeorm';
import { GenericRepository } from '@libs/repository/genericRepository';
import { TempFile } from '@domain/entities';
import { BotWizard } from '@domain/entities/schema/botWizard.entity';
import { BotWizardStatus } from '@domain/common/enum/botWizardStatus';

@Injectable()
export class CleanupTempFileService {
  private readonly logger = new Logger(CleanupTempFileService.name);
  private readonly tempFileRepository: GenericRepository<TempFile>;
  private readonly botWizardRepository: GenericRepository<BotWizard>;

  constructor(
    private manager: EntityManager,
  ) {
    this.tempFileRepository = new GenericRepository(TempFile, manager);
    this.botWizardRepository = new GenericRepository(BotWizard, manager);
  }

  @Cron('0 */6 * * *')
  async cleanupTempFiles() {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const expiredFiles = await this.tempFileRepository.find({
      where: { expiredAt: Between(last24Hours, now) },
    });

    for (const file of expiredFiles) {
      try {
        if (file.filePath) {
          const absolutePath = join(tempFilesRootDir, file.filePath);

          if (existsSync(absolutePath)) {
            rmSync(absolutePath, { recursive: true, force: true });
            this.logger.log(`Deleted temp: ${file.filePath}`);
          }
        }

        const botWizard = await this.botWizardRepository.findOne({
          where: { tempFileId: file.id },
        });

        if (botWizard) {
          await this.botWizardRepository.update(botWizard.id, { status: BotWizardStatus.EXPIRED });
        }
      } catch (err) {
        this.logger.error(`Failed to delete temp ${file.id}`, err);
      }
    }
  }
}
