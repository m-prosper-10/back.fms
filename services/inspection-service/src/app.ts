import { Express } from "express";
import { createServiceApp } from "../../../shared/http/createServiceApp";
import { env } from "./config/env";
import { inspectionServiceRouter } from "./routes";

export function createApp() {
  return createServiceApp({
    serviceName: env.appName,
    nodeEnv: env.nodeEnv,
    allowedOrigins: env.allowedOrigins,
    registerRoutes(app: Express) {
      app.use("/api", inspectionServiceRouter);
    }
  });
}
