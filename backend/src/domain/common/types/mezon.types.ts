import { ModuleMetadata } from '@nestjs/common';

export interface MezonClientConfig {
  token: string;
  botId: string;
}

export interface MezonModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (...args: any[]) => Promise<any> | any;
  inject?: any[];
}
