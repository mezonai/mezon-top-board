import { BaseWizardProcessor } from "@libs/processor/baseWizardProcessor";
import { NestJSProcessor } from "@libs/processor/nestjsProcessors";
import { PythonProcessor } from "@libs/processor/pythonProcessor";

export class WizardProcessorFactory {
  static create(language: string, payload: any): BaseWizardProcessor {
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
