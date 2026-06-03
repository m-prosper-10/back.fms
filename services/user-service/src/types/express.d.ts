import "express";
import type { UserRole, UserStatus } from "../modules/users/user.types";

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
