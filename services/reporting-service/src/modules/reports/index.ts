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

reportRouter.get("/meta", authenticate, authorize("admin", "inspector", "user"), getReportModuleStatus);
reportRouter.get("/", authenticate, authorize("admin", "inspector", "user"), getReportModuleStatus);

reportRouter.get("/dashboard", authenticate, authorize("admin", "inspector", "user"), dashboard);

reportRouter.get("/inventory", authenticate, authorize("admin", "inspector", "user"), inventory);
reportRouter.get("/inventory/daily", authenticate, authorize("admin", "inspector", "user"), inventoryDaily);
reportRouter.get("/inventory/monthly", authenticate, authorize("admin", "inspector", "user"), inventoryMonthly);
reportRouter.get("/inventory/yearly", authenticate, authorize("admin", "inspector", "user"), inventoryYearly);

reportRouter.get("/inspections", authenticate, authorize("admin", "inspector", "user"), inspections);
reportRouter.get("/inspections/pending", authenticate, authorize("admin", "inspector", "user"), pendingInspections);
reportRouter.get("/inspections/completed", authenticate, authorize("admin", "inspector", "user"), completedInspections);
reportRouter.get("/inspections/overdue", authenticate, authorize("admin", "inspector", "user"), overdueInspections);

reportRouter.get("/compliance", authenticate, authorize("admin", "inspector", "user"), compliance);
reportRouter.get("/compliance/expired", authenticate, authorize("admin", "inspector", "user"), expiredCompliance);
reportRouter.get("/compliance/upcoming-expirations", authenticate, authorize("admin", "inspector", "user"), upcomingExpirations);

reportRouter.get("/maintenance", authenticate, authorize("admin", "inspector", "user"), maintenance);
reportRouter.get("/maintenance/history", authenticate, authorize("admin", "inspector", "user"), maintenanceHistory);
reportRouter.get("/maintenance/frequency", authenticate, authorize("admin", "inspector", "user"), maintenanceFrequency);
reportRouter.get("/maintenance/recent", authenticate, authorize("admin", "inspector", "user"), maintenanceRecent);

reportRouter.get("/export/pdf", authenticate, authorize("admin", "inspector"), exportPdf);
reportRouter.get("/export/csv", authenticate, authorize("admin", "inspector"), exportCsv);
