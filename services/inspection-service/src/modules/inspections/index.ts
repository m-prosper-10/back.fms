import { Router } from "express";

export const inspectionRouter = Router();

inspectionRouter.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      module: "inspections",
      status: "scaffold",
      responsibilities: ["schedules", "results", "maintenance-triggering"]
    }
  });
});
