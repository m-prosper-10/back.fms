import { Router } from "express";

export const reportRouter = Router();

reportRouter.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      module: "reports",
      status: "scaffold",
      responsibilities: ["dashboard", "inventory-reports", "export"]
    }
  });
});
