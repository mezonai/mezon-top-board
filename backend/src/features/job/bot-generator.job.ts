import { Injectable, OnModuleInit } from '@nestjs/common';
import { QueueService } from '@features/queue/queue.service';
import { BotGeneratorJobData } from '@features/job/job-data.types';
import { TempStorageService } from '@features/temp-storage/temp-storage.service';
import { BotWizardRequest } from '@features/bot-generator/dtos/request';
import { WizardProcessorFactory } from '@features/bot-generator/processors/wizard-factory';
import envConfig from '@config/env.config';

@Injectable()
export class BotGeneratorJob implements OnModuleInit {
  private readonly queueName = 'bot-generator-queue';
  constructor(
    private readonly queue: QueueService,
    private readonly tempStorageService: TempStorageService
  ) {}

  async onModuleInit() {
    await this.queue.create(this.queueName);

    await this.queue.work<BotGeneratorJobData>(
      this.queueName,
      async (jobs) => {
        for (const job of jobs) {
          await this.handle(job.data);
        }
      },
    );
  }

  async processJob(payload: BotWizardRequest, ownerId: string, botWizardId: string) {
    const processor = WizardProcessorFactory.create(payload.language, payload);
    const zipBuffer = await processor.process();

    const saveTempFileArgs = {
      buffer: zipBuffer,
      fileName: `${payload.botName}.zip`,
      mimeType: 'application/zip',
      path: envConfig().BOT_GENERATED_FILE_DIR
    };

    await this.tempStorageService.saveTemp(saveTempFileArgs, ownerId, botWizardId);
  }

  private async handle(data: BotGeneratorJobData) {
    const { payload, ownerId, botWizardId } = data;
    await this.processJob(payload, ownerId, botWizardId);
  }

  async addToQueue(data: BotGeneratorJobData) {
    return await this.queue.send<BotGeneratorJobData>(this.queueName, data);
  }
}