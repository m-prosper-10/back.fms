import { Request, Response } from "express";
import { env } from "../config/env";

export function getHealth(_req: Request, res: Response) {
  res.status(200).json({
    status: "ok",
    service: env.appName,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
}
