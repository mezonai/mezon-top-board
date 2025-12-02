import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MezonClientService } from '@app/services/mezon-client.service';
import { MezonClientConfig, MezonModuleAsyncOptions } from '@app/types/mezon.types';

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
                            token: configService.get<string>('MEZON_TOKEN'),
                            botId: configService.get<string>('MEZON_BOT_ID'),
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