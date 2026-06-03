import { Router } from "express";
import { getHealth } from "../controllers/healthController";
import { extinguisherRouter } from "../modules/extinguishers";

export const extinguisherServiceRouter = Router();

extinguisherServiceRouter.get("/health", getHealth);
extinguisherServiceRouter.use("/extinguishers", extinguisherRouter);
