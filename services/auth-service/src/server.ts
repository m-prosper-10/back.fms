import { createApp } from "./app";
import { env } from "./config/env";
import { connectAuthDatabase } from "./config/database";
import { logger } from "../../../shared/lib/logger";

async function bootstrap() {
  await connectAuthDatabase();

  const app = createApp();

  app.listen(env.port, () => {
    logger.info(`${env.appName} listening on port ${env.port}`);
  });
}

bootstrap().catch((error: Error) => {
  logger.error(`Failed to start ${env.appName}`, error);
  process.exit(1);
});
