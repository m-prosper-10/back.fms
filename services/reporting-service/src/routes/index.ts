import { Router } from "express";
import { getHealth } from "../controllers/healthController";
import { reportRouter } from "../modules/reports";

export const reportingServiceRouter = Router();

reportingServiceRouter.get("/health", getHealth);
reportingServiceRouter.use("/reports", reportRouter);
