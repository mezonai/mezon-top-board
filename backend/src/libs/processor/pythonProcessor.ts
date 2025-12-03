import { BaseWizardProcessor } from './BaseWizardProcessor';
import * as path from 'path';
import * as fs from 'fs-extra';

export class PythonProcessor extends BaseWizardProcessor {
  async process(): Promise<Buffer> {
    const outputDir = path.join('/tmp', `python-${Date.now()}`);
    await fs.mkdirp(outputDir);

    const templateRoot = path.join(process.cwd(), 'bot-gen-templates', 'python');
    await this.renderDirectory(templateRoot, outputDir);

    await this.generateCommandFiles(outputDir);

    return this.zipFolder(outputDir);
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
