import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../../shared/lib/httpError";
import { UserRole } from "../modules/reports/report.types";

export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      next(new AppError(401, "Unauthorized"));
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(new AppError(403, "Forbidden"));
      return;
    }

    next();
  };
}
