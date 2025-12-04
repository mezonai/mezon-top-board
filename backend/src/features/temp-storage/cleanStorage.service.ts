import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import * as fs from "fs-extra";
import * as path from "path";

@Injectable()
export class CleanupService {
  private readonly SOURCE_DIR = '/tmp/bot-source-files';
  private readonly EXPIRE_TIME = 24 * 3600000;

  @Cron('0 */6 * * *')
  async cleanupOldFolders() {
    const now = Date.now();

    const exist = await fs.pathExists(this.SOURCE_DIR);
    if (!exist) return;

    const items = await fs.readdir(this.SOURCE_DIR);

    for (const folder of items) {
      const folderPath = path.join(this.SOURCE_DIR, folder);
      const stats = await fs.stat(folderPath);

      if (now - stats.mtimeMs > this.EXPIRE_TIME) {
        await fs.remove(folderPath);
        console.log(`Cleaned old temp folder: ${folder}`);
      }
    }
  }
}
