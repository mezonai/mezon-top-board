import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import helmet from 'helmet';
import { json, urlencoded } from "express";
import { AllExceptionsFilter } from "@domain/common/filters/all-exception.filter";
import config from "@config/env.config";
import { configStaticFiles } from "@config/files.config";
import { configHbsPartials } from "@config/hbs";
import { configSwagger } from "@config/swagger.config";
import { AppModule } from "./app.module";

configHbsPartials();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  app.use(helmet({
    frameguard: { action: 'deny' },
    xssFilter: true,
    noSniff: true,
    hidePoweredBy: true,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "https://www.googletagmanager.com",
          "https://www.google-analytics.com",
        ],
        imgSrc: ["'self'", "data:", "blob:", "https://www.google-analytics.com"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        connectSrc: ["'self'", "https://www.google-analytics.com"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
  }));
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    next();
  });
  app.use(json({ limit: '26mb' }));
  app.use(urlencoded({ limit: '26mb', extended: true }));
  app.enableCors({
    origin: [config().APP_CLIENT_URL],
    credentials: true,
  });
  app.useGlobalFilters(new AllExceptionsFilter());
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
