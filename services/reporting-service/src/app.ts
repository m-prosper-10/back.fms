import { Express } from "express";
import { createServiceApp } from "../../../shared/http/createServiceApp";
import { createOpenApiRouter } from "../../../shared/openapi/openapi";
import { env } from "./config/env";
import { reportingOpenApiDocument } from "./docs/openapi";
import { reportingServiceRouter } from "./routes";

export function createApp() {
  return createServiceApp({
    serviceName: env.appName,
    nodeEnv: env.nodeEnv,
    allowedOrigins: env.allowedOrigins,
    beforeRoutes(app: Express) {
      app.disable("etag");
      app.use((req, res, next) => {
        if (req.path.startsWith("/api/reports")) {
          res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
          res.setHeader("Pragma", "no-cache");
          res.setHeader("Expires", "0");
        }

        next();
      });
    },
    registerRoutes(app: Express) {
      app.use("/", createOpenApiRouter(reportingOpenApiDocument));
      app.use("/api", reportingServiceRouter);
    }
  });
}
