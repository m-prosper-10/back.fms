import { Router } from "express";
import { getUserModuleStatus } from "./user.controller";

export const userRouter = Router();

userRouter.get("/", getUserModuleStatus);
