import envConfig from '@config/env.config';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as fs from 'fs-extra';
import * as path from 'path';

@Injectable()
export class CleanupTempFileService {
  private readonly logger = new Logger(CleanupTempFileService.name);

  private readonly EXPIRE_TIME = 24 * 3600 * 1000;

  @Cron('0 */6 * * *')
  async cleanupTempFiles() {
    const rootDir = path.join(process.cwd(), envConfig().TEMP_FILE_DIR, envConfig().BOT_GENERATED_FILE_DIR);

    const exists = await fs.pathExists(rootDir);
    if (!exists) return;

    const now = Date.now();
    const files = await fs.readdir(rootDir);

    for (const fileName of files) {
      const filePath = path.join(rootDir, fileName);
      const stats = await fs.stat(filePath);

      if (now - stats.mtimeMs > this.EXPIRE_TIME) {
        try {
          await fs.remove(filePath);
          this.logger.log(`Deleted temp file: ${fileName}`);
        } catch (err) {
          this.logger.error(`Failed to delete ${fileName}`, err);
        }
      }
    }
  }
}
