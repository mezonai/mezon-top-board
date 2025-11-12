import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MezonClientService } from '@features/mezon-noti-bot/mezon-client.service';
import { MezonClientConfig, MezonModuleAsyncOptions } from '@domain/common/types/mezon.types';
import config from "@config/env.config";

@Global()
@Module({})
export class MezonModule {
  static forRootAsync(options: MezonModuleAsyncOptions): DynamicModule {
    return {
      module: MezonModule,
      imports: options.imports,
      providers: [
        {
          provide: MezonClientService,
          useFactory: async (configService: ConfigService) => {
            const clientConfig: MezonClientConfig = {
              token: config().MEZON_TOKEN,
              botId: config().MEZON_BOT_ID,
            };

            const client = new MezonClientService(clientConfig);

            await client.initializeClient();

            return client;
          },
          inject: [ConfigService],
        },
      ],
      exports: [MezonClientService],
    };
  }
}
