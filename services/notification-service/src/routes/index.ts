import { Router } from "express";
import { getHealth } from "../controllers/healthController";
import { notificationRouter } from "../modules/notifications";

export const notificationServiceRouter = Router();

notificationServiceRouter.get("/health", getHealth);
notificationServiceRouter.use("/notifications", notificationRouter);
