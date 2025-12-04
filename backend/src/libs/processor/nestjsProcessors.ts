import { BaseWizardProcessor } from './BaseWizardProcessor';
import * as path from 'path';
import * as fs from 'fs-extra';

export class NestJSProcessor extends BaseWizardProcessor {
  async process(): Promise<Buffer> {
    const outputDir = path.join('/tmp', `nestjs-${Date.now()}`);
    await fs.mkdirp(outputDir);

    const templateRoot = path.join(process.cwd(), 'bot-gen-templates', 'nestjs');
    await this.renderDirectory(templateRoot, outputDir);

    await this.generateCommandFiles(outputDir);

    return this.zipFolder(outputDir);
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