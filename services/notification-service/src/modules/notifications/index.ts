import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { authenticateInternalService } from "../../middleware/internalAuthenticate";
import {
  getById,
  getNotificationModuleStatus,
  list,
  listByType,
  listByUser,
  markAsRead,
  internalSend,
  remove,
  send,
  update
} from "./notification.controller";

export const notificationRouter = Router();

notificationRouter.get("/meta", authenticate, authorize("admin", "inspector", "user"), getNotificationModuleStatus);
notificationRouter.post("/send", authenticate, authorize("admin"), send);
notificationRouter.post("/internal/send", authenticateInternalService, internalSend);
notificationRouter.get("/", authenticate, list);
notificationRouter.get("/type/:type", authenticate, listByType);
notificationRouter.get("/user/:userId", authenticate, authorize("admin"), listByUser);
notificationRouter.patch("/:id/read", authenticate, markAsRead);
notificationRouter.patch("/:id", authenticate, authorize("admin"), update);
notificationRouter.delete("/:id", authenticate, authorize("admin"), remove);
notificationRouter.get("/:id", authenticate, getById);
