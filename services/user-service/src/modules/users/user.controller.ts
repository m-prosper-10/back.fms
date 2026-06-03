import { Request, Response } from "express";
import { userService } from "./user.service";

export function getUserModuleStatus(_req: Request, res: Response) {
  res.status(200).json({
    success: true,
    data: userService.describe()
  });
}
