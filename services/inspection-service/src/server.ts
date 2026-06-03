import { createApp } from "./app";
import { env } from "./config/env";
import { logger } from "../../../shared/lib/logger";

const app = createApp();

app.listen(env.port, () => {
  logger.info(`${env.appName} listening on port ${env.port}`);
});
