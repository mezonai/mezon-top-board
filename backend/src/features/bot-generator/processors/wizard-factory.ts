import { BotWizardRequest } from "@features/bot-generator/dtos/request";
import { BaseWizardProcessor } from "@features/bot-generator/processors/base-wizard.processor";
import { NestJSProcessor } from "@features/bot-generator/processors/nestjs.processor";
import { PythonProcessor } from "@features/bot-generator/processors/python.processor";

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