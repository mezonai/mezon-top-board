import * as fs from 'fs-extra';
import * as path from 'path';
import * as archiver from 'archiver';
import * as Handlebars from 'handlebars';

export class TempStorageHelper {
  static async renderDirectory(srcDir: string, destDir: string, payload: any, defaultExt = '.ts') {
    const items = await fs.readdir(srcDir);

    for (const item of items) {
      const srcPath = path.join(srcDir, item);
      let destPath = path.join(destDir, item);
      const stat = await fs.stat(srcPath);

      if (stat.isDirectory()) {
        await fs.mkdirp(destPath);
        await this.renderDirectory(srcPath, destPath, payload, defaultExt);
      } else if (item.endsWith('.hbs')) {
        const content = await fs.readFile(srcPath, 'utf8');
        const template = Handlebars.compile(content);
        const rendered = template(payload);

        const ext = defaultExt;
        destPath = path.join(destDir, path.basename(item, '.hbs') + ext);

        await fs.writeFile(destPath, rendered);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  }

  static async generateCommandFiles(baseOutputDir: string, commands: any[], template: string, ext = 'ts') {
    if (!Array.isArray(commands) || commands.length === 0) return;

    const commandsDir = path.join(baseOutputDir, 'src', 'command');
    await fs.mkdirp(commandsDir);

    for (const cmd of commands) {
      const compile = Handlebars.compile(template);
      const rendered = compile(cmd);
      const filePath = path.join(commandsDir, `${cmd.className}.${ext}`);
      await fs.writeFile(filePath, rendered);
    }
  }

  static async zipFolder(folderPath: string): Promise<Buffer> {
    const zipPath = `${folderPath}.zip`;
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      archive.directory(folderPath, false);
      archive.pipe(output);
      archive.finalize();

      output.on('close', async () => {
        const buffer = await fs.readFile(zipPath);
        await fs.remove(zipPath);
        resolve(buffer);
      });

      archive.on('error', reject);
    });
  }
}