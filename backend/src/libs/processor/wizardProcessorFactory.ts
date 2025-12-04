import { BotWizardRequest } from "@features/bot-generator/dtos/request";
import { BaseWizardProcessor } from "@libs/processor/baseWizardProcessor";
import { NestJSProcessor } from "@libs/processor/nestjsProcessors";
import { PythonProcessor } from "@libs/processor/pythonProcessor";

export class WizardProcessorFactory {
  static create(language: string, payload: BotWizardRequest): BaseWizardProcessor {
    switch (language.toLowerCase()) {
      case 'nestjs':
        return new NestJSProcessor(payload);
      case 'python':
        return new PythonProcessor(payload);
      default:
        throw new Error(`Unsupported language: ${language}`);
    }
  }
}