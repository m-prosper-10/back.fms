import { Router } from "express";

export const notificationRouter = Router();

notificationRouter.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      module: "notifications",
      status: "scaffold",
      responsibilities: ["in-app", "email", "overdue-alerts"]
    }
  });
});
