import * as fs from 'fs';
import { join, basename } from 'path';
import * as archiver from 'archiver';
import * as Handlebars from 'handlebars';
import { BotWizardRequest, CommandWizardRequest } from '@features/bot-generator/dtos/request';

export class BotTemplateBuilder {
  static async renderDirectory(srcDir: string, destDir: string, payload: BotWizardRequest) {
    const items = await fs.promises.readdir(srcDir);

    for (const item of items) {
      const srcPath = join(srcDir, item);
      let destPath = join(destDir, item);
      const stat = await fs.promises.stat(srcPath);

      if (stat.isDirectory()) {
        await fs.promises.mkdir(destPath, { recursive: true });
        await this.renderDirectory(srcPath, destPath, payload);
        continue;
      }

      if (item.endsWith('.hbs')) {
        const content = await fs.promises.readFile(srcPath, 'utf8');
        Handlebars.registerHelper('includes', function (array, value, options) {
          if (Array.isArray(array) && array.includes(value)) {
            return options.fn(this);
          }
          return options.inverse(this);
        });
        const template = Handlebars.compile(content);
        const rendered = template(payload);

        destPath = join(destDir, basename(item, '.hbs'));

        await fs.promises.writeFile(destPath, rendered);
        continue;
      }
      await fs.promises.copyFile(srcPath, destPath);
    }
  }

  static async generateCommandFiles(baseOutputDir: string, commands: CommandWizardRequest[], template: string, ext = 'ts') {
    if (!Array.isArray(commands) || commands.length === 0) return;

    const commandsDir = join(baseOutputDir, 'src', 'command');
    await fs.promises.mkdir(commandsDir, { recursive: true });

    for (const cmd of commands) {
      const compile = Handlebars.compile(template);
      const rendered = compile(cmd);
      const filePath = join(commandsDir, `${cmd.className}.${ext}`);
      await fs.promises.writeFile(filePath, rendered);
    }
  }

  static async zipFolder(folderPath: string): Promise<Buffer> {
    const zipPath = `${folderPath}.zip`;

    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', async () => {
        const buffer = await fs.promises.readFile(zipPath);
        await fs.promises.rm(zipPath);
        resolve(buffer);
      });

      archive.on('warning', console.warn);
      archive.on('error', reject);

      archive.pipe(output);
      archive.directory(folderPath, false);

      archive.finalize();
    });
  }
}