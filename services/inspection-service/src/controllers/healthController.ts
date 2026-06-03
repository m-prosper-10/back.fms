import { Request, Response } from "express";
import { env } from "../config/env";

export function getHealth(_req: Request, res: Response) {
  res.status(200).json({
    success: true,
    data: {
      service: env.appName,
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    }
  });
}
