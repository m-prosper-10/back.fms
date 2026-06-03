import { Router } from "express";
import { getHealth } from "../controllers/healthController";
import { authRouter } from "../modules/auth";

export const authServiceRouter = Router();

authServiceRouter.get("/health", getHealth);
authServiceRouter.use("/auth", authRouter);
