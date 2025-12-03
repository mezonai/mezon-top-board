import * as fs from 'fs-extra';
import * as path from 'path';
import * as archiver from 'archiver';
import * as Handlebars from 'handlebars';

export abstract class BaseWizardProcessor {
  protected payload: any;

  constructor(payload: any) {
    this.payload = payload;
  }

  abstract process(): Promise<Buffer>;

  protected async renderDirectory(srcDir: string, destDir: string) {
    const items = await fs.readdir(srcDir);

    for (const item of items) {
      const srcPath = path.join(srcDir, item);
      let destPath = path.join(destDir, item);
      const stat = await fs.stat(srcPath);

      if (stat.isDirectory()) {
        await fs.mkdirp(destPath);
        await this.renderDirectory(srcPath, destPath);
      }

      else if (item.endsWith('.hbs')) {
        const content = await fs.readFile(srcPath, 'utf8');
        const template = Handlebars.compile(content);
        const rendered = template(this.payload);

        const ext = this.getFileExtension(item);
        destPath = path.join(destDir, path.basename(item, '.hbs') + ext);

        await fs.writeFile(destPath, rendered);
      }

      else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  }

  /** GENERATE COMMAND FILE */
  protected async generateCommandFiles(baseOutputDir: string) {
    if (!Array.isArray(this.payload.commands) || this.payload.commands.length === 0) return;

    // bắt buộc generate vào src/command
    const commandsDir = path.join(baseOutputDir, 'src', 'command');
    await fs.mkdirp(commandsDir);

    const template = this.getCommandTemplate();
    const ext = this.getCommandExtension();

    for (const cmd of this.payload.commands) {
      const compile = Handlebars.compile(template);
      const rendered = compile(cmd);

      const filePath = path.join(commandsDir, `${cmd.className}.${ext}`);
      await fs.writeFile(filePath, rendered);
    }
  }

  /** ZIP FILE */
  protected async zipFolder(folderPath: string): Promise<Buffer> {
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

  /** OVERRIDE PER LANGUAGE */
  protected getFileExtension(item: string): string {
    return '.ts'; // mặc định NestJS
  }

  protected getCommandTemplate(): string {
    return '';
  }

  protected getCommandExtension(): string {
    return 'ts';
  }
}
