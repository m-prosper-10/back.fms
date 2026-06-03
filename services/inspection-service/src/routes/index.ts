import { Router } from "express";
import { getHealth } from "../controllers/healthController";
import { inspectionRouter } from "../modules/inspections";
import { maintenanceRouter } from "../modules/inspections";

export const inspectionServiceRouter = Router();

inspectionServiceRouter.get("/health", getHealth);
inspectionServiceRouter.use("/inspections", inspectionRouter);
inspectionServiceRouter.use("/maintenance", maintenanceRouter);
