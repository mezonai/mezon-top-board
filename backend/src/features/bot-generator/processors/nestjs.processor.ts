import { BaseWizardProcessor } from './base-wizard.processor';
import { join } from 'path';
import * as fs from 'fs';
import { tempFilesRootDir } from '@config/files.config';

export class NestJSProcessor extends BaseWizardProcessor {
  async process(): Promise<Buffer> {
    const outputDir = join(tempFilesRootDir, `nestjs-${Date.now()}`);
    await fs.promises.mkdir(outputDir, { recursive: true });

    const templateRoot = join(process.cwd(), 'bot-gen-templates', 'nestjs');
    await this.renderDirectory(templateRoot, outputDir);

    await this.generateCommandFiles(outputDir);

    const zipBuffer = await this.zipFolder(outputDir);
    await fs.promises.rm(outputDir, { recursive: true, force: true });
    
    return zipBuffer;
  }

  protected getCommandTemplate(): string {
    return `
      import { ChannelMessage } from 'mezon-sdk';
      import { Command } from '@app/decorators/command.decorator';
      import { CommandMessage } from '@app/command/common/command.abstract';

      @Command('{{command}}', {
        description: '{{description}}',
        usage: '!{{command}}',
        category: '{{category}}',
        aliases: [{{#each aliases}}"{{this}}",{{/each}}]
      })
      export class {{className}} extends CommandMessage {
        execute(args: string[], message: ChannelMessage) {
          const msg = \`{{command}} executed!\`;
          return this.replyMessageGenerate({ messageContent: msg }, message);
        }
      }
    `;
  }

  protected getCommandExtension(): string {
    return 'ts';
  }
}