import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import { notFoundHandler } from "./middleware/notFound";
import { apiRouter } from "./routes";
import { metricsRouter } from "./routes/metrics";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.allowedOrigins
    })
  );
  app.use(express.json());
  app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
  app.get("/", (_req, res) => {
    res.json({
      service: env.appName,
      status: "ok",
      stack: "node-ts-express",
      apiStyle: "rest"
    });
  });

  app.use("/api", apiRouter);
  app.use("/metrics", metricsRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
