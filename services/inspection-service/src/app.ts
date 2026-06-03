import { Express } from "express";
import { createServiceApp } from "../../../shared/http/createServiceApp";
import { createOpenApiRouter } from "../../../shared/openapi/openapi";
import { env } from "./config/env";
import { inspectionOpenApiDocument } from "./docs/openapi";
import { inspectionServiceRouter } from "./routes";

export function createApp() {
  return createServiceApp({
    serviceName: env.appName,
    nodeEnv: env.nodeEnv,
    allowedOrigins: env.allowedOrigins,
    registerRoutes(app: Express) {
      app.use("/", createOpenApiRouter(inspectionOpenApiDocument));
      app.use("/api", inspectionServiceRouter);
    }
  });
}
