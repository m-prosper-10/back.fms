import { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import { AppError } from "../lib/httpError";
import { logger } from "../lib/logger";

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      details: error.details ?? null
    });
    return;
  }

  logger.error(error.message, error);

  res.status(500).json({
    success: false,
    message: env.nodeEnv === "production" ? "Internal server error" : error.message
  });
}
