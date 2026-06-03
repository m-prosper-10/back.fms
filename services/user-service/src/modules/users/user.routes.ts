import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import {
  createUserHandler,
  changePassword,
  deleteUserHandler,
  getMe,
  getUserByIdHandler,
  getUserModuleMeta,
  listInspectorsHandler,
  listUsersHandler,
  updateMe,
  updateUserByIdHandler,
  updateUserRoleHandler,
  updateUserStatusHandler
} from "./user.controller";

export const userRouter = Router();

userRouter.get("/meta", authenticate, authorize("admin"), getUserModuleMeta);
userRouter.post("/", authenticate, authorize("admin"), createUserHandler);
userRouter.get("/inspectors", authenticate, listInspectorsHandler);
userRouter.get("/", authenticate, authorize("admin"), listUsersHandler);
userRouter.get("/me", authenticate, getMe);
userRouter.patch("/me", authenticate, updateMe);
userRouter.patch("/change-password", authenticate, changePassword);
userRouter.get("/:id", authenticate, authorize("admin"), getUserByIdHandler);
userRouter.patch("/:id", authenticate, authorize("admin"), updateUserByIdHandler);
userRouter.delete("/:id", authenticate, authorize("admin"), deleteUserHandler);
userRouter.patch("/:id/role", authenticate, authorize("admin"), updateUserRoleHandler);
userRouter.patch("/:id/status", authenticate, authorize("admin"), updateUserStatusHandler);
