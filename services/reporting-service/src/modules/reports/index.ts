import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import {
  compliance,
  dashboard,
  expiredCompliance,
  exportCsv,
  exportPdf,
  getReportModuleStatus,
  inventory,
  inventoryDaily,
  inventoryMonthly,
  inventoryYearly,
  maintenance,
  maintenanceFrequency,
  maintenanceHistory,
  maintenanceRecent,
  overdueInspections,
  pendingInspections,
  completedInspections,
  inspections,
  upcomingExpirations
} from "./report.controller";

export const reportRouter = Router();

reportRouter.get("/meta", authenticate, authorize("admin", "inspector"), getReportModuleStatus);
reportRouter.get("/", authenticate, authorize("admin", "inspector"), getReportModuleStatus);

reportRouter.get("/dashboard", authenticate, authorize("admin", "inspector"), dashboard);

reportRouter.get("/inventory", authenticate, authorize("admin", "inspector"), inventory);
reportRouter.get("/inventory/daily", authenticate, authorize("admin", "inspector"), inventoryDaily);
reportRouter.get("/inventory/monthly", authenticate, authorize("admin", "inspector"), inventoryMonthly);
reportRouter.get("/inventory/yearly", authenticate, authorize("admin", "inspector"), inventoryYearly);

reportRouter.get("/inspections", authenticate, authorize("admin", "inspector"), inspections);
reportRouter.get("/inspections/pending", authenticate, authorize("admin", "inspector"), pendingInspections);
reportRouter.get("/inspections/completed", authenticate, authorize("admin", "inspector"), completedInspections);
reportRouter.get("/inspections/overdue", authenticate, authorize("admin", "inspector"), overdueInspections);

reportRouter.get("/compliance", authenticate, authorize("admin", "inspector"), compliance);
reportRouter.get("/compliance/expired", authenticate, authorize("admin", "inspector"), expiredCompliance);
reportRouter.get("/compliance/upcoming-expirations", authenticate, authorize("admin", "inspector"), upcomingExpirations);

reportRouter.get("/maintenance", authenticate, authorize("admin", "inspector"), maintenance);
reportRouter.get("/maintenance/history", authenticate, authorize("admin", "inspector"), maintenanceHistory);
reportRouter.get("/maintenance/frequency", authenticate, authorize("admin", "inspector"), maintenanceFrequency);
reportRouter.get("/maintenance/recent", authenticate, authorize("admin", "inspector"), maintenanceRecent);

reportRouter.get("/export/pdf", authenticate, authorize("admin", "inspector"), exportPdf);
reportRouter.get("/export/csv", authenticate, authorize("admin", "inspector"), exportCsv);
