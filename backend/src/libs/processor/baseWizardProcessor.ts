import { TempStorageHelper } from "@libs/utils/tempStorageHelper";

export abstract class BaseWizardProcessor {
  protected payload: any;

  constructor(payload: any) {
    this.payload = payload;
  }

  abstract process(): Promise<Buffer>;

  protected async renderDirectory(srcDir: string, destDir: string) {
    await TempStorageHelper.renderDirectory(srcDir, destDir, this.payload, this.getFileExtension(''));
  }

  protected async generateCommandFiles(baseOutputDir: string) {
    await TempStorageHelper.generateCommandFiles(
      baseOutputDir,
      this.payload.commands,
      this.getCommandTemplate(),
      this.getCommandExtension()
    );
  }

  protected async zipFolder(folderPath: string) {
    return TempStorageHelper.zipFolder(folderPath);
  }

  protected getFileExtension(item: string): string {
    return '.ts';
  }

  protected getCommandTemplate(): string {
    return '';
  }

  protected getCommandExtension(): string {
    return 'ts';
  }
}
