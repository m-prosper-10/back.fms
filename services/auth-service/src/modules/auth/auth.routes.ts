import { Router } from "express";
import {
  forgotPassword,
  getAuthModuleStatus,
  login,
  logout,
  refreshToken,
  register,
  resetPassword,
  validateToken
} from "./auth.controller";

export const authRouter = Router();

authRouter.get("/", getAuthModuleStatus);
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/refresh-token", refreshToken);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);
authRouter.get("/validate-token", validateToken);
