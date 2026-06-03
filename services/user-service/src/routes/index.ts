import { Router } from "express";
import { getHealth } from "../controllers/healthController";
import { userRouter } from "../modules/users";

export const userServiceRouter = Router();

userServiceRouter.get("/health", getHealth);
userServiceRouter.use("/users", userRouter);
