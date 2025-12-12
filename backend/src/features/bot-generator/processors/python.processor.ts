import { BaseWizardProcessor } from './base-wizard.processor';
import { join } from 'path';
import * as fs from 'fs';
import { tempFilesRootDir } from '@config/files.config';

export class PythonProcessor extends BaseWizardProcessor {
  async process(): Promise<Buffer> {
    const outputDir = join(tempFilesRootDir, `python-${Date.now()}`);
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

  protected getListenerTemplate(): string {
    return `
      def on_{{eventName}}(event):
          print("{{eventName}} event received:", event)
    `;
  }

  protected getFileExtension(): string {
    return 'py';
  }
}