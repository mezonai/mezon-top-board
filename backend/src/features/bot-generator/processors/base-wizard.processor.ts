import { BotWizardRequest } from "@features/bot-generator/dtos/request";
import { BotTemplateBuilder } from "@features/bot-generator/bot-template-builder";

export abstract class BaseWizardProcessor {
  protected payload: BotWizardRequest;

  constructor(payload: BotWizardRequest) {
    this.payload = payload;
  }

  abstract process(): Promise<Buffer>;

  protected async renderDirectory(srcDir: string, destDir: string) {
    await BotTemplateBuilder.renderDirectory(srcDir, destDir, this.payload);
  }

  protected async generateCommandFiles(baseOutputDir: string) {
    await BotTemplateBuilder.generateCommandFiles(
      baseOutputDir,
      this.payload.commands,
      this.getCommandTemplate(),
      this.getFileExtension()
    );
  }

  protected async generateEventListeners(baseOutputDir: string) {
    await BotTemplateBuilder.generateEventListeners(
      baseOutputDir,
      this.payload.events,
      this.getListenerTemplate(),
      this.getFileExtension()
    );
  }

  protected async zipFolder(folderPath: string) {
    return BotTemplateBuilder.zipFolder(folderPath);
  }

  protected abstract getCommandTemplate(): string;

  protected abstract getListenerTemplate(): string;

  protected abstract getFileExtension(): string;
}