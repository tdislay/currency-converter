import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { loadConfig } from "./config";

async function bootstrap(): Promise<void> {
  await loadConfig();

  const app = await NestFactory.create(AppModule);

  // Setup plugins
  app.enableCors({ origin: "http://localhost:8080" });

  await app.listen(3000);
}

void bootstrap();
