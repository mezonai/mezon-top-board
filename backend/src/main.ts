import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { json, urlencoded } from "express";

import config from "@config/env.config";
import { configStaticFiles } from "@config/files.config";
import { configHbsPartials } from "@config/hbs";
import { configSwagger } from "@config/swagger.config";

import { AppModule } from "./app.module";
import { APP_CONSTANTS } from "@domain/common/constants/constants";
import { BotGateway } from "@gateway/bot.gateway";

configHbsPartials();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  app.enableCors();
  app.use(json({ limit: '26mb' }));
  app.use(urlencoded({ limit: '26mb', extended: true }));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  configSwagger(app);
  configStaticFiles(app);

  app.enableCors({
    origin: APP_CONSTANTS.HTTP.CORS.ORIGIN,
    methods: APP_CONSTANTS.HTTP.CORS.METHODS,
  });

  const bot = app.get(BotGateway);
  bot.initEvent();

  await app.listen(config().PORT);
  console.log(`Server is running on http://localhost:${config().PORT}/api`);
}
bootstrap();
