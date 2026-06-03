import { AppError } from "../../../../../shared/lib/httpError";
import {
  aggregateExtinguishersBy,
  aggregateExtinguishersByDate,
  aggregateInspectionsBy,
  aggregateMaintenanceBy,
  countExtinguishers,
  countInspections,
  countMaintenanceLogs,
  listExtinguishers,
  listInspections,
  listMaintenanceLogs
} from "./report.repository";
import {
  ComplianceReport,
  DashboardReport,
  DateRange,
  ExportFormat,
  ExportReport,
  ExtinguisherDocument,
  ExtinguisherReportEntry,
  InspectionReport,
  InspectionStatus,
  MaintenanceReport,
  ReportPeriod
} from "./report.types";

function activeMatch() {
  return { isDeleted: { $ne: true } } as const;
}

function createDateRangeMatch(field: string, range?: DateRange) {
  if (!range?.from && !range?.to) {
    return {};
  }

  const match: Record<string, unknown> = {};
  if (range.from) {
    match.$gte = range.from;
  }
  if (range.to) {
    match.$lte = range.to;
  }

  return { [field]: match };
}

function buildOverdueInspectionMatch() {
  return {
    $or: [
      { status: "overdue" },
      { status: "pending", inspectionDate: { $lt: new Date() } }
    ]
  };
}

function flattenToCsvRows(report: DashboardReport & {
  inventory: { total: number };
  inspections: { total: number };
  compliance: { total: number };
  maintenance: { total: number };
}) {
  return [
    "metric,value",
    `totalExtinguishers,${report.totalExtinguishers}`,
    `activeExtinguishers,${report.activeExtinguishers}`,
    `expiredExtinguishers,${report.expiredExtinguishers}`,
    `underMaintenance,${report.underMaintenance}`,
    `pendingInspections,${report.pendingInspections}`,
    `completedInspections,${report.completedInspections}`,
    `overdueInspections,${report.overdueInspections}`,
    `upcomingExpirations,${report.upcomingExpirations}`,
    `inventoryTotal,${report.inventory.total}`,
    `inspectionTotal,${report.inspections.total}`,
    `complianceTotal,${report.compliance.total}`,
    `maintenanceTotal,${report.maintenance.total}`
  ].join("\n");
}

function ensureRange(range?: DateRange) {
  if (range?.from && range?.to && range.from > range.to) {
    throw new AppError(400, "End date must be on or after start date");
  }
}

export const reportService = {
  async getDashboard() {
    const now = new Date();
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const [
      totalExtinguishers,
      activeExtinguishers,
      expiredExtinguishers,
      underMaintenance,
      pendingInspections,
      completedInspections,
      overdueInspections,
      upcomingExpirations,
      recentMaintenance
    ] = await Promise.all([
      countExtinguishers(activeMatch()),
      countExtinguishers({ ...activeMatch(), status: "active" }),
      countExtinguishers({ ...activeMatch(), status: "expired" }),
      countExtinguishers({ ...activeMatch(), status: "maintenance" }),
      countInspections({ status: "pending" }),
      countInspections({ status: "completed" }),
      countInspections(buildOverdueInspectionMatch()),
      countExtinguishers({
        ...activeMatch(),
        expiryDate: { $gte: now, $lte: in30Days }
      }),
      listMaintenanceLogs({}, { limit: 5, sort: { maintenanceDate: -1 } })
    ]);

    return {
      totalExtinguishers,
      activeExtinguishers,
      expiredExtinguishers,
      underMaintenance,
      pendingInspections,
      completedInspections,
      overdueInspections,
      upcomingExpirations,
      recentMaintenance
    } satisfies DashboardReport;
  },

  async getInventory(range?: DateRange) {
    ensureRange(range);

    const match = {
      ...activeMatch(),
      ...createDateRangeMatch("createdAt", range)
    };

    const [totalExtinguishers, byStatus, byType, byLocation, timeline] = await Promise.all([
      countExtinguishers(match),
      aggregateExtinguishersBy("status", match),
      aggregateExtinguishersBy("type", match),
      aggregateExtinguishersBy("location", match),
      aggregateExtinguishersByDate("monthly", match)
    ]);

    return {
      totalExtinguishers,
      byStatus,
      byType,
      byLocation,
      timeline
    };
  },

  async getInventoryByPeriod(period: ReportPeriod, range?: DateRange) {
    ensureRange(range);

    const match = {
      ...activeMatch(),
      ...createDateRangeMatch("createdAt", range)
    };

    const totalExtinguishers = await countExtinguishers(match);
    const timeline = await aggregateExtinguishersByDate(period, match);

    return {
      totalExtinguishers,
      period,
      timeline
    };
  },

  async getInspectionSummary(range?: DateRange) {
    ensureRange(range);

    const match = createDateRangeMatch("inspectionDate", range);
    const [totalInspections, byStatus, byResult, recentInspections] = await Promise.all([
      countInspections(match),
      aggregateInspectionsBy("status", match),
      aggregateInspectionsBy("result", match),
      listInspections(match, { limit: 10, sort: { inspectionDate: -1 } })
    ]);

    return {
      totalInspections,
      byStatus,
      byResult,
      recentInspections
    } satisfies InspectionReport;
  },

  async getInspectionByStatus(status: InspectionStatus, range?: DateRange) {
    ensureRange(range);

    const match = {
      status,
      ...createDateRangeMatch("inspectionDate", range)
    };

    const [totalInspections, byStatus, byResult, recentInspections] = await Promise.all([
      countInspections(match),
      aggregateInspectionsBy("status", match),
      aggregateInspectionsBy("result", match),
      listInspections(match, { limit: 10, sort: { inspectionDate: -1 } })
    ]);

    return {
      totalInspections,
      byStatus,
      byResult,
      recentInspections
    } satisfies InspectionReport;
  },

  async getCompliance() {
    const now = new Date();
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const [totalExtinguishers, expiredExtinguishers, expiringWithin30Days, compliantExtinguishers, overdueInspections, upcomingExpirations] =
      await Promise.all([
        countExtinguishers(activeMatch()),
        countExtinguishers({ ...activeMatch(), expiryDate: { $lt: now } }),
        countExtinguishers({ ...activeMatch(), expiryDate: { $gte: now, $lte: in30Days } }),
        countExtinguishers({
          ...activeMatch(),
          status: "active",
          expiryDate: { $gte: now }
        }),
        countInspections(buildOverdueInspectionMatch()),
        listExtinguishers(
          {
            ...activeMatch(),
            expiryDate: { $gte: now, $lte: in30Days }
          },
          { limit: 20, sort: { expiryDate: 1 } }
        )
      ]);

    return {
      totalExtinguishers,
      expiredExtinguishers,
      expiringWithin30Days,
      compliantExtinguishers,
      overdueInspections,
      upcomingExpirations
    } satisfies ComplianceReport;
  },

  async getMaintenanceSummary(range?: DateRange) {
    ensureRange(range);

    const match = createDateRangeMatch("maintenanceDate", range);
    const [totalMaintenanceLogs, byAction, frequencyByMonth, recentMaintenance] = await Promise.all([
      countMaintenanceLogs(match),
      aggregateMaintenanceBy("actionTaken", match),
      aggregateMaintenanceBy("maintenanceDate", match),
      listMaintenanceLogs(match, { limit: 10, sort: { maintenanceDate: -1 } })
    ]);

    return {
      totalMaintenanceLogs,
      byAction,
      frequencyByMonth,
      recentMaintenance
    } satisfies MaintenanceReport;
  },

  async getMaintenanceHistory(range?: DateRange) {
    ensureRange(range);
    return listMaintenanceLogs(createDateRangeMatch("maintenanceDate", range), {
      sort: { maintenanceDate: -1 }
    });
  },

  async getMaintenanceFrequency(range?: DateRange) {
    ensureRange(range);
    return aggregateMaintenanceBy("maintenanceDate", createDateRangeMatch("maintenanceDate", range));
  },

  async getMaintenanceRecent(range?: DateRange) {
    ensureRange(range);
    return listMaintenanceLogs(createDateRangeMatch("maintenanceDate", range), {
      limit: 5,
      sort: { maintenanceDate: -1 }
    });
  },

  async exportPdf() {
    const [dashboard, inventory, inspections, compliance, maintenance] = await Promise.all([
      reportService.getDashboard(),
      reportService.getInventory(),
      reportService.getInspectionSummary(),
      reportService.getCompliance(),
      reportService.getMaintenanceSummary()
    ]);

    return {
      format: "pdf" as const,
      filename: `reporting-summary-${Date.now()}.pdf`,
      generatedAt: new Date().toISOString(),
      sections: {
        dashboard,
        inventory,
        inspections,
        compliance,
        maintenance
      }
    } satisfies ExportReport;
  },

  async exportCsv() {
    const [dashboard, inventory, inspections, compliance, maintenance] = await Promise.all([
      reportService.getDashboard(),
      reportService.getInventory(),
      reportService.getInspectionSummary(),
      reportService.getCompliance(),
      reportService.getMaintenanceSummary()
    ]);

    const summary = {
      total: dashboard.totalExtinguishers,
      inventory: { total: inventory.totalExtinguishers },
      inspections: { total: inspections.totalInspections },
      compliance: { total: compliance.totalExtinguishers },
      maintenance: { total: maintenance.totalMaintenanceLogs }
    };

    return {
      format: "csv" as const,
      filename: `reporting-summary-${Date.now()}.csv`,
      generatedAt: new Date().toISOString(),
      sections: {
        dashboard,
        inventory,
        inspections,
        compliance,
        maintenance
      },
      csv: flattenToCsvRows({
        ...dashboard,
        inventory: summary.inventory,
        inspections: summary.inspections,
        compliance: summary.compliance,
        maintenance: summary.maintenance
      } as DashboardReport & {
        inventory: { total: number };
        inspections: { total: number };
        compliance: { total: number };
        maintenance: { total: number };
      })
    } satisfies ExportReport;
  }
};
