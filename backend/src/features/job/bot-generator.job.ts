import { Injectable, OnModuleInit } from '@nestjs/common';
import { QueueService } from '@features/queue/queue.service';
import { WizardProcessorFactory } from '@libs/processor/wizardProcessorFactory';
import { BotGeneratorJobData } from '@features/job/data.job';
import { TempStorageService } from '@features/temp-storage/temp-storage.service';
import { BotWizardRequest } from '@features/bot-generator/dtos/request';

@Injectable()
export class BotGeneratorJob implements OnModuleInit {
  constructor( 
    private readonly queue: QueueService,
    private readonly tempStorageService: TempStorageService,
  ) {}

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

    const processor = WizardProcessorFactory.create(payload.templateName, payload);
    const zipBuffer = await processor.process();
    
    await this.tempStorageService.saveTemp(tempFileId, zipBuffer);
  }


  private async handle(data: BotGeneratorJobData) {
    const { tempFileId, payload } = data;
    await this.processJob(tempFileId, payload);
  }

  async addToQueue(data: BotGeneratorJobData) {
    return await this.queue.send<BotGeneratorJobData>('bot-generator-queue', data);
  }
}