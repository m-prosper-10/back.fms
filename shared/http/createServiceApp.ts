import cors from "cors";
import express, { Express } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { createErrorHandler } from "../middleware/errorHandler";
import { notFoundHandler } from "../middleware/notFound";

export interface CreateServiceAppOptions {
  serviceName: string;
  nodeEnv: "development" | "test" | "production";
  allowedOrigins: string[];
  beforeRoutes?: (app: Express) => void;
  registerRoutes: (app: Express) => void;
}

export function createServiceApp({
  serviceName,
  nodeEnv,
  allowedOrigins,
  beforeRoutes,
  registerRoutes
}: CreateServiceAppOptions) {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: allowedOrigins
    })
  );
  app.use(express.json());
  app.use(morgan(nodeEnv === "production" ? "combined" : "dev"));
  app.get("/", (_req, res) => {
    res.json({
      success: true,
      data: {
        service: serviceName,
        status: "ok",
        stack: "node-ts-express",
        architecture: "microservices-monorepo"
      }
    });
  });

  beforeRoutes?.(app);
  registerRoutes(app);

  app.use(notFoundHandler);
  app.use(createErrorHandler(nodeEnv === "production"));

  return app;
}
