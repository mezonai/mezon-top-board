import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { QueueService } from '@features/queue/queue.service';
import { BotGeneratorJobData } from '@features/job/data.job';
import { GenericRepository } from '@libs/repository/genericRepository';
import { TempSourceFile } from '@domain/entities';
import { EntityManager } from 'typeorm';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as archiver from 'archiver';
import * as Handlebars from 'handlebars';
import { TempSourceFileStatus } from '@domain/common/enum/tempSourceFileStatus';
import { WizardProcessorFactory } from '@libs/processor/wizardProcessorFactory';

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

  async processJob(tempFileId: string, payload: any) {
    const tempSourceFile = await this.tempSourceFileRepository.findById(tempFileId);
    if (!tempSourceFile) throw new BadRequestException("Temp file not found");

    // const templateRoot = path.join(process.cwd(), "bot-gen-templates", payload.templateName);
    // const tempOutput = path.join('/tmp', `bot-${Date.now()}`);

    // await fs.mkdirp(tempOutput);
    // await this.renderDirectory(templateRoot, tempOutput, payload);

    // const zipBuffer = await this.zipFolder(tempOutput);
    // await fs.remove(tempOutput);
    const processor = WizardProcessorFactory.create(payload.templateName, payload);
    const zipBuffer = await processor.process();
    
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
