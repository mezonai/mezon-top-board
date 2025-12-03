import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { QueueService } from '@features/queue/queue.service';
import { BotGeneratorJobData } from '@features/job/data.job';
import { GenericRepository } from '@libs/repository/genericRepository';
import { TempSourceFile } from '@domain/entities';
import { EntityManager } from 'typeorm';
import * as fs from 'fs-extra';
import * as path from 'path';
import { TempSourceFileStatus } from '@domain/common/enum/tempSourceFileStatus';
import { BotWizardRequest } from '@features/bot-generator/dtos/request';
import { TempStorageHelper } from '@libs/utils/tempStorageHelper';

@Injectable()
export class BotGeneratorJob implements OnModuleInit {
  private readonly tempSourceFileRepository: GenericRepository<TempSourceFile>;
  
  constructor(
    private manager: EntityManager,
    private readonly queue: QueueService,
  ) {
    this.tempSourceFileRepository = new GenericRepository(TempSourceFile, manager);
  }

  async onModuleInit() {
    await this.queue.create('bot-generator-queue');

    await this.queue.work<BotGeneratorJobData>(
      'bot-generator-queue',
      async (jobs) => {
        for (const job of jobs) {
          await this.handle(job.data);
        }
      },
    );
  }

  async processJob(tempFileId: string, payload: BotWizardRequest) {
    const tempSourceFile = await this.tempSourceFileRepository.findById(tempFileId);
    if (!tempSourceFile) throw new BadRequestException("Temp file not found");

    const templateRoot = path.join(process.cwd(), "bot-gen-templates", payload.templateName);
    const tempOutput = path.join('/tmp', `bot-${Date.now()}`);

    await fs.mkdirp(tempOutput);

    await TempStorageHelper.renderDirectory(templateRoot, tempOutput, payload);

    const commandTemplate = `
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

    if (Array.isArray(payload.commands) && payload.commands.length > 0) {
      await TempStorageHelper.generateCommandFiles(tempOutput, payload.commands, commandTemplate);
    }

    const zipBuffer = await TempStorageHelper.zipFolder(tempOutput);
    await fs.remove(tempOutput);

    const tempFolder = path.join('/tmp/bot-source-files', tempFileId);
    await fs.mkdirp(tempFolder);

    const filePath = path.join(tempFolder, tempSourceFile.fileName);
    await fs.writeFile(filePath, zipBuffer);

    await this.tempSourceFileRepository.update(tempFileId, {
      filePath,
      status: TempSourceFileStatus.COMPLETED,
      completedAt: new Date(),
    });
  }

  private async handle(data: BotGeneratorJobData) {
    const { tempFileId, payload } = data;
    await this.processJob(tempFileId, payload);
  }

  async addToQueue(data: BotGeneratorJobData) {
    return await this.queue.send<BotGeneratorJobData>('bot-generator-queue', data);
  }
}
