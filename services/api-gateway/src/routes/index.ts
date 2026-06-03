import { Router } from "express";
import { getHealth } from "../controllers/healthController";
import { env } from "../config/env";
import { exampleRouter } from "./v1/exampleRoutes";
import { createProxyHandler } from "../lib/proxy";

export const apiRouter = Router();

apiRouter.get("/health", getHealth);

apiRouter.get("/monitoring", (_req, res) => {
  res.status(200).json({
    success: true,
    data: { status: "metrics-enabled" }
  });
});

apiRouter.use("/auth", createProxyHandler(env.services.auth));
apiRouter.use("/users", createProxyHandler(env.services.users));
apiRouter.use("/extinguishers", createProxyHandler(env.services.extinguishers));
apiRouter.use("/inspections", createProxyHandler(env.services.inspections));
apiRouter.use("/maintenance", createProxyHandler(env.services.inspections));
apiRouter.use("/reports", createProxyHandler(env.services.reports));
apiRouter.use("/notifications", createProxyHandler(env.services.notifications));

apiRouter.use("/v1/examples", exampleRouter);
