import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MezonClientService } from '@features/mezon-noti-bot/mezon-client.service';
import { MezonClientConfig, MezonModuleAsyncOptions } from '@domain/common/types/mezon.types';
import config from "@config/env.config";
import { BotGateway } from '@gateway/bot.gateway';

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
              host: config().MEZON_HOST,
              port: config().MEZON_PORT,
              useSSL: true,
              timeout: 7000,
            };

            const client = new MezonClientService(clientConfig);

            await client.initializeClient();

            return client;
          },
          inject: [ConfigService],
        },
        BotGateway,
      ],
      exports: [MezonClientService],
    };
  }
}
