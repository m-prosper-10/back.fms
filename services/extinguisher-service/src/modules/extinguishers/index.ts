import { Router } from "express";

export const extinguisherRouter = Router();

extinguisherRouter.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      module: "extinguishers",
      status: "scaffold",
      responsibilities: ["inventory", "status-tracking", "expiry-tracking"]
    }
  });
});
