import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../../../shared/lib/httpError";
import { reportService } from "./report.service";
import {
  reportExportFormatSchema,
  reportPeriodSchema,
  reportRangeSchema
} from "./report.validation";

function requireUser(req: Request) {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
  }

  return req.user;
}

function parseRange(query: Request["query"]) {
  if (!query || Object.keys(query).length === 0) {
    return undefined;
  }

  const result = reportRangeSchema.safeParse(query);
  if (!result.success) {
    throw new AppError(400, "Invalid report query", result.error.flatten());
  }

  return result.data;
}

export async function getReportModuleStatus(_req: Request, res: Response) {
  res.status(200).json({
    success: true,
    data: {
      module: "reports",
      status: "ready",
      endpoints: [
        "GET /api/reports/dashboard",
        "GET /api/reports/inventory",
        "GET /api/reports/inventory/daily",
        "GET /api/reports/inventory/monthly",
        "GET /api/reports/inventory/yearly",
        "GET /api/reports/inspections",
        "GET /api/reports/inspections/pending",
        "GET /api/reports/inspections/completed",
        "GET /api/reports/inspections/overdue",
        "GET /api/reports/compliance",
        "GET /api/reports/compliance/expired",
        "GET /api/reports/compliance/upcoming-expirations",
        "GET /api/reports/maintenance",
        "GET /api/reports/maintenance/history",
        "GET /api/reports/maintenance/frequency",
        "GET /api/reports/maintenance/recent",
        "GET /api/reports/export/pdf",
        "GET /api/reports/export/csv"
      ]
    }
  });
}

export async function dashboard(req: Request, res: Response, next: NextFunction) {
  try {
    requireUser(req);
    const data = await reportService.getDashboard();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function inventory(req: Request, res: Response, next: NextFunction) {
  try {
    requireUser(req);
    const data = await reportService.getInventory(parseRange(req.query));
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function inventoryDaily(req: Request, res: Response, next: NextFunction) {
  try {
    requireUser(req);
    const data = await reportService.getInventoryByPeriod(reportPeriodSchema.parse("daily"), parseRange(req.query));
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function inventoryMonthly(req: Request, res: Response, next: NextFunction) {
  try {
    requireUser(req);
    const data = await reportService.getInventoryByPeriod(reportPeriodSchema.parse("monthly"), parseRange(req.query));
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function inventoryYearly(req: Request, res: Response, next: NextFunction) {
  try {
    requireUser(req);
    const data = await reportService.getInventoryByPeriod(reportPeriodSchema.parse("yearly"), parseRange(req.query));
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function inspections(req: Request, res: Response, next: NextFunction) {
  try {
    requireUser(req);
    const data = await reportService.getInspectionSummary(parseRange(req.query));
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function pendingInspections(req: Request, res: Response, next: NextFunction) {
  try {
    requireUser(req);
    const data = await reportService.getInspectionByStatus("pending", parseRange(req.query));
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function completedInspections(req: Request, res: Response, next: NextFunction) {
  try {
    requireUser(req);
    const data = await reportService.getInspectionByStatus("completed", parseRange(req.query));
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function overdueInspections(req: Request, res: Response, next: NextFunction) {
  try {
    requireUser(req);
    const data = await reportService.getOverdueInspectionSummary(parseRange(req.query));
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function compliance(req: Request, res: Response, next: NextFunction) {
  try {
    requireUser(req);
    const data = await reportService.getCompliance();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function expiredCompliance(req: Request, res: Response, next: NextFunction) {
  try {
    requireUser(req);
    const data = await reportService.getCompliance();
    res.status(200).json({
      success: true,
      data: {
        totalExtinguishers: data.totalExtinguishers,
        expiredExtinguishers: data.expiredExtinguishers,
        expiringWithin30Days: data.expiringWithin30Days,
        compliantExtinguishers: data.compliantExtinguishers,
        overdueInspections: data.overdueInspections,
        expiredExtinguishersList: data.expiredExtinguishersList
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function upcomingExpirations(req: Request, res: Response, next: NextFunction) {
  try {
    requireUser(req);
    const data = await reportService.getCompliance();
    res.status(200).json({
      success: true,
      data: {
        totalExtinguishers: data.totalExtinguishers,
        expiredExtinguishers: data.expiredExtinguishers,
        expiringWithin30Days: data.expiringWithin30Days,
        compliantExtinguishers: data.compliantExtinguishers,
        overdueInspections: data.overdueInspections,
        upcomingExpirations: data.upcomingExpirations
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function maintenance(req: Request, res: Response, next: NextFunction) {
  try {
    requireUser(req);
    const data = await reportService.getMaintenanceSummary(parseRange(req.query));
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function maintenanceHistory(req: Request, res: Response, next: NextFunction) {
  try {
    requireUser(req);
    const data = await reportService.getMaintenanceHistory(parseRange(req.query));
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function maintenanceFrequency(req: Request, res: Response, next: NextFunction) {
  try {
    requireUser(req);
    const data = await reportService.getMaintenanceFrequency(parseRange(req.query));
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function maintenanceRecent(req: Request, res: Response, next: NextFunction) {
  try {
    requireUser(req);
    const data = await reportService.getMaintenanceRecent(parseRange(req.query));
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function exportPdf(req: Request, res: Response, next: NextFunction) {
  try {
    requireUser(req);
    reportExportFormatSchema.parse("pdf");
    const data = await reportService.exportPdf();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function exportCsv(req: Request, res: Response, next: NextFunction) {
  try {
    requireUser(req);
    reportExportFormatSchema.parse("csv");
    const data = await reportService.exportCsv();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
