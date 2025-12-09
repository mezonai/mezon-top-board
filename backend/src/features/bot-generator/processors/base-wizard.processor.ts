import { BotWizardRequest } from "@features/bot-generator/dtos/request";
import { BotTemplateBuilder } from "@features/bot-generator/templateGenerator";

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
      this.getCommandExtension()
    );
  }

  protected async zipFolder(folderPath: string) {
    return BotTemplateBuilder.zipFolder(folderPath);
  }

  protected abstract getCommandTemplate(): string;

  protected abstract getCommandExtension(): string;
}