import * as fs from 'fs-extra';
import * as path from 'path';
import * as archiver from 'archiver';
import * as Handlebars from 'handlebars';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BotGeneratorService {

  async generateBotProject(payload: any): Promise<Buffer> {
    const templateRoot = path.join(process.cwd(), "bot-gen-templates", payload.templateName);
    const tempOutput = path.join('/tmp', `bot-${Date.now()}`);

    await fs.mkdirp(tempOutput);
    await this.renderDirectory(templateRoot, tempOutput, payload);

    if (payload.templateName === 'default') {
      const commandsDir = path.join(tempOutput, "src", "command");
      await fs.mkdirp(commandsDir);
      for (const cmd of payload.commands ?? []) {
        await this.generateCommandFile(commandsDir, cmd);
      }
    }

    const zip = await this.zipFolder(tempOutput);
    await fs.remove(tempOutput);

    return zip;
  }

  private async renderDirectory(srcDir: string, destDir: string, payload: any) {
    const items = await fs.readdir(srcDir);

    for (const item of items) {
      const srcPath = path.join(srcDir, item);
      let destPath = path.join(destDir, item);

      const stat = await fs.stat(srcPath);

      if (stat.isDirectory()) {
        await fs.mkdirp(destPath);
        await this.renderDirectory(srcPath, destPath, payload);
      }

      else if (item.endsWith('.hbs')) {
        const realName = item.replace('.hbs', '');
        const templateContent = await fs.readFile(srcPath, 'utf8');
        const template = Handlebars.compile(templateContent);
        const rendered = template(payload);
        destPath = path.join(destDir, realName);
        await fs.writeFile(destPath, rendered);
      }

      else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  }

  private async zipFolder(folderPath: string): Promise<Buffer> {
    const zipPath = `${folderPath}.zip`;

    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      archive.directory(folderPath, false);
      archive.pipe(output);

      archive.finalize();

      output.on('close', async () => {
        const data = await fs.readFile(zipPath);
        await fs.remove(zipPath);
        resolve(data);
      });

      archive.on('error', reject);
    });
  }

  private async generateCommandFile(commandsDir: string, payload: any) {

    const template = `
      import { ChannelMessage } from 'mezon-sdk';
      import { Command } from '@app/decorators/command.decorator';
      import { CommandMessage } from '@app/command/common/command.abstract';

      @Command('{{command}}', {
        description: '{{description}}',
        usage: '!{{command}}',
        category: '{{category}}',
        aliases: [{{#each aliases}}"{{this}}",{{/each}}],
      })
      export class {{className}} extends CommandMessage {
        execute(args: string[], message: ChannelMessage) {
          const messageContent = \`{{command}} executed!\`; 
          return this.replyMessageGenerate({ messageContent }, message);
        }
      }
    `;

    const compile = Handlebars.compile(template);
    const rendered = compile(payload);

    const filePath = path.join(commandsDir, `${payload.className}.ts`);
    await fs.writeFile(filePath, rendered);
  }
}
