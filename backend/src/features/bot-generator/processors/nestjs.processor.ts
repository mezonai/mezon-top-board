import { BaseWizardProcessor } from './base-wizard.processor';
import { join } from 'path';
import { promises } from 'fs';
import { tempFilesRootDir } from '@config/files.config';

export class NestJSProcessor extends BaseWizardProcessor {
  async process(): Promise<Buffer> {
    const outputDir = join(tempFilesRootDir, `nestjs-${Date.now()}`);
    await promises.mkdir(outputDir, { recursive: true });

    const templateRoot = join(process.cwd(), 'bot-gen-templates', 'nestjs');
    await this.renderDirectory(templateRoot, outputDir);

    await this.generateCommandFiles(outputDir);

    await this.generateEventListeners(outputDir);

    const zipBuffer = await this.zipFolder(outputDir);
    await promises.rm(outputDir, { recursive: true, force: true });
    
    return zipBuffer;
  }

  protected getCommandTemplate(): string {
    return `import { ChannelMessage } from 'mezon-sdk';
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
}`;
  }

  protected getListenerTemplate(): string {
    return `import { ClientConfigService } from '@app/config/client.config';
import { CommandService } from '@app/services/command.service';
import { MessageQueue } from '@app/services/message-queue.service';
import { MezonClientService } from '@app/services/mezon-client.service';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Events, MezonClient{{#if eventType}}, {{eventType}}{{/if}} } from 'mezon-sdk';
import { ERROR_MESSAGES } from '@app/common/constants';

@Injectable()
export class {{eventClass}} {
  private readonly client: MezonClient;
  private readonly logger = new Logger({{eventClass}}.name);

  constructor(
      private readonly clientService: MezonClientService,
      private readonly clientConfigService: ClientConfigService,
      private readonly commandService: CommandService,
      private readonly messageQueue: MessageQueue,
  ) {
      this.client = clientService.getClient();
  }

  @OnEvent(Events.{{eventName}})
  async handleCommand(data{{#if eventType}}: {{eventType}}{{/if}}): Promise<void> {
      try {

      } catch (error) {
          this.logger.error(ERROR_MESSAGES.CHANNEL_MESSAGE_PROCESSING, error);
      }
  }
}
`;
  }

  protected getFileExtension(): string {
    return 'ts';
  }
}