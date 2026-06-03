import { createServiceApp } from "../../../../shared/http/createServiceApp";
import { env } from "./config/env";
import { extinguisherServiceRouter } from "./routes";

export function createApp() {
  return createServiceApp({
    serviceName: env.appName,
    nodeEnv: env.nodeEnv,
    allowedOrigins: env.allowedOrigins,
    registerRoutes(app) {
      app.use("/api", extinguisherServiceRouter);
    }
  });
}
