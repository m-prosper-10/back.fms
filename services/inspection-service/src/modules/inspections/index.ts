import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import {
  byExtinguisher,
  byStatus,
  complete,
  createMaintenance,
  getById,
  getInspectionModuleStatus,
  getMaintenanceModuleStatus,
  getMaintenanceById,
  list,
  listMaintenance,
  maintenanceByExtinguisher,
  overdue,
  remove,
  removeMaintenance,
  schedule,
  update,
  updateMaintenance
} from "./inspection.controller";

export const inspectionRouter = Router();

inspectionRouter.get("/meta", authenticate, authorize("admin", "inspector"), getInspectionModuleStatus);
inspectionRouter.post("/", authenticate, authorize("admin", "user"), schedule);
inspectionRouter.get("/", authenticate, list);
inspectionRouter.get("/status/:status", authenticate, byStatus);
inspectionRouter.get("/overdue", authenticate, overdue);
inspectionRouter.get("/extinguisher/:extinguisherId", authenticate, byExtinguisher);
inspectionRouter.get("/:id", authenticate, getById);
inspectionRouter.patch("/:id", authenticate, authorize("admin", "inspector"), update);
inspectionRouter.patch("/:id/complete", authenticate, authorize("admin", "inspector"), complete);
inspectionRouter.delete("/:id", authenticate, authorize("admin", "inspector"), remove);

export const maintenanceRouter = Router();

maintenanceRouter.get("/meta", authenticate, authorize("admin", "inspector"), getMaintenanceModuleStatus);
maintenanceRouter.post("/", authenticate, authorize("admin", "inspector"), createMaintenance);
maintenanceRouter.get("/", authenticate, listMaintenance);
maintenanceRouter.get("/extinguisher/:extinguisherId", authenticate, maintenanceByExtinguisher);
maintenanceRouter.get("/:id", authenticate, getMaintenanceById);
maintenanceRouter.patch("/:id", authenticate, authorize("admin", "inspector"), updateMaintenance);
maintenanceRouter.delete("/:id", authenticate, authorize("admin", "inspector"), removeMaintenance);
