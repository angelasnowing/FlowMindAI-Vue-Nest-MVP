import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = config.get<number>("PORT", 3000);
  const apiPrefix = config.get<string>("API_PREFIX", "api");
  const corsOrigins = config
    .get<string>(
      "CORS_ORIGINS",
      "https://flow-mind-ai-vue-nest-mvp-web.vercel.app,http://localhost:5173,http://localhost:5174",
    )
    .split(",")
    .map((origin) =>
      origin
        .trim()
        .replace(/^["']|["']$/g, "")
        .replace(/\/$/, ""),
    )
    .filter(Boolean);

  app.enableCors({
    origin(origin, callback) {
      if (!origin || corsOrigins.includes(origin.replace(/\/$/, ""))) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
    credentials: true,
  });
  app.setGlobalPrefix(apiPrefix);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(port, "0.0.0.0");
}
bootstrap();
