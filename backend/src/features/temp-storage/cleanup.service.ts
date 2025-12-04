import { TempSourceFileStatus } from "@domain/common/enum/tempSourceFileStatus";
import { TempSourceFile } from "@domain/entities";
import { GenericRepository } from "@libs/repository/genericRepository";
import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import * as fs from "fs-extra";
import * as path from "path";
import { EntityManager, Not } from "typeorm";

@Injectable()
export class CleanupService {
  private readonly SOURCE_DIR = '/tmp/bot-source-files';
  private readonly EXPIRE_TIME = 24 * 3600000;
  private readonly tempSourceFileRepository: GenericRepository<TempSourceFile>;

  constructor(private manager: EntityManager) {
    this.tempSourceFileRepository = new GenericRepository(TempSourceFile, manager);
  }

  @Cron('0 */6 * * *')
  async cleanupOldFolders() {
    const now = Date.now();

    const exist = await fs.pathExists(this.SOURCE_DIR);
    if (!exist) return;

    const folders = await fs.readdir(this.SOURCE_DIR);

    for (const folder of folders) {
      const folderPath = path.join(this.SOURCE_DIR, folder);
      const stats = await fs.stat(folderPath);

      if (now - stats.mtimeMs > this.EXPIRE_TIME) {
        await fs.remove(folderPath);
        await this.updateRecordStatusByFolder(folder);
      }
    }
  }

  private async updateRecordStatusByFolder(id: string) {
    const tempFile = await this.tempSourceFileRepository.findOne({
      where: { id, status: Not(TempSourceFileStatus.EXPIRED) }
    });

    if (!tempFile) {
      console.log(`Skip update status: record not found or already expired. id=${id}`);
      return;
    }

    await this.tempSourceFileRepository.update(tempFile.id, {
      status: TempSourceFileStatus.EXPIRED
    });
  }
}