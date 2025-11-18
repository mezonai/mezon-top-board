import { BadRequestException, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { json, urlencoded } from "express";

import config from "@config/env.config";
import { configStaticFiles } from "@config/files.config";
import { configHbsPartials } from "@config/hbs";
import { configSwagger } from "@config/swagger.config";

import { AppModule } from "./app.module";

configHbsPartials();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  app.enableCors({
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    const allowedOrigins = [
      /^https?:\/\/([a-zA-Z0-9-]+\.)*nccsoft\.vn$/,
      /^https?:\/\/([a-zA-Z0-9-]+\.)*mezon\.ai$/,
      /^http?:\/\/localhost(:\d+)?$/,
    ];

    const isAllowed = allowedOrigins.some((pattern) => pattern.test(origin));

    if (isAllowed) {
      return callback(null, true);
    } else {
      return callback(new BadRequestException(`Origin ${origin} not allowed by CORS`), false);
    }
  },
  credentials: true,
});
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

  await app.listen(config().PORT);
  console.log(`Server is running on http://localhost:${config().PORT}/api`);
}
bootstrap();
