import { BaseWizardProcessor } from './BaseWizardProcessor';
import { join } from 'path';
import * as fs from 'fs';

export class PythonProcessor extends BaseWizardProcessor {
  async process(): Promise<Buffer> {
    const outputDir = join('/tmp', `python-${Date.now()}`);
    await fs.promises.mkdir(outputDir, { recursive: true });

    const templateRoot = join(process.cwd(), 'bot-gen-templates', 'python');
    await this.renderDirectory(templateRoot, outputDir);

    await this.generateCommandFiles(outputDir);

    const zipBuffer = await this.zipFolder(outputDir);

    await fs.promises.rm(outputDir, { recursive: true, force: true });

    return zipBuffer;
  }

  protected getCommandTemplate(): string {
    return `
      def {{command}}(message):
          print("{{command}} executed!")
    `;
  }

  protected getCommandExtension(): string {
    return 'py';
  }

  protected getFileExtension(): string {
    return '.py';
  }
}