import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../../shared/lib/httpError";
import { env } from "../config/env";
import { UserRole, UserStatus } from "../modules/reports/report.types";

interface AccessTokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  tokenType: "access";
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    next(new AppError(401, "Authorization header is required"));
    return;
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, env.raw.JWT_ACCESS_SECRET) as AccessTokenPayload;

    if (payload.tokenType !== "access" || payload.status !== "active") {
      throw new Error("Invalid token");
    }

    req.user = {
      id: payload.userId,
      email: payload.email,
      role: payload.role,
      status: payload.status
    };

    next();
  } catch {
    next(new AppError(401, "Invalid or expired access token"));
  }
}
