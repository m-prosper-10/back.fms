import "express";
import { UserRole, UserStatus } from "../modules/notifications/notification.types";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      email: string;
      role: UserRole;
      status: UserStatus;
    };
  }
}
