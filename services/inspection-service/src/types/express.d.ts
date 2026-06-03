import "express";
import type { UserRole, UserStatus } from "../modules/inspections/inspection.types";

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
