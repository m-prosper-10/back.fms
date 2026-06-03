import { Request, Response } from "express";
import { authService } from "./auth.service";

export function getAuthModuleStatus(_req: Request, res: Response) {
  res.status(200).json({
    success: true,
    data: authService.describe()
  });
}
