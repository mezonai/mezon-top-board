import { dataSourceOption } from '@app/config/data-source.config';
import config, { envFilePath } from '@app/config/env.config';
import * as Joi from '@hapi/joi';
import { BotModule } from '@app/modules/bot.module';
import { MezonModule } from '@app/modules/mezon.module';
import { HealthController } from '@app/controllers/health.controller';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [config],
            validationSchema: Joi.object({
                POSTGRES_HOST: Joi.string().required(),
                POSTGRES_PORT: Joi.number().required(),
                POSTGRES_USER: Joi.string().required(),
                POSTGRES_PASSWORD: Joi.string().required(),
                POSTGRES_DB: Joi.string().required(),
                MEZON_TOKEN: Joi.string().required(),
            }),
            isGlobal: true,
            envFilePath: envFilePath,
        }),
        TypeOrmModule.forRoot(dataSourceOption),
        EventEmitterModule.forRoot(),
        MezonModule.forRootAsync({
            imports: [ConfigModule],
        }),
        BotModule,
    ],
    controllers: [HealthController],
})
export class AppModule { }