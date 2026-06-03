import { Router } from "express";
import { getHealth } from "../controllers/healthController";
import { exampleRouter } from "./v1/exampleRoutes";

export const apiRouter = Router();

apiRouter.get("/health", getHealth);

apiRouter.get("/monitoring", (_req, res) => {
  res.status(200).json({
    success: true,
    data: { status: "metrics-enabled" }
  });
});
apiRouter.use("/v1/examples", exampleRouter);
