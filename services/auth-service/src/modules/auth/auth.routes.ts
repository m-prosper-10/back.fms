import { Router } from "express";
import { getAuthModuleStatus } from "./auth.controller";

export const authRouter = Router();

authRouter.get("/", getAuthModuleStatus);
