import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../../../shared/lib/httpError";
import { env } from "../config/env";

export function authenticateInternalService(req: Request, _res: Response, next: NextFunction) {
  const token = req.header("x-internal-token");

  if (!token || token !== env.internalServiceToken) {
    next(new AppError(403, "Forbidden"));
    return;
  }

  next();
}
