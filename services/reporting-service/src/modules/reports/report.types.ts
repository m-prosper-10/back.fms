import { ObjectId } from "mongodb";

export type UserRole = "admin" | "inspector" | "user";
export type UserStatus = "active" | "inactive" | "suspended";
export type ExtinguisherStatus = "active" | "expired" | "maintenance" | "decommissioned";
export type ExtinguisherType = "Water" | "CO2" | "Foam" | "Dry Chemical";
export type ExtinguisherSize = "1.5 lb" | "5 lb" | "9 lb" | "12 lb";
export type InspectionStatus = "pending" | "completed" | "overdue" | "cancelled";
export type InspectionResult = "passed" | "failed" | "requires_maintenance";
export type ReportPeriod = "daily" | "monthly" | "yearly";
export type ExportFormat = "pdf" | "csv";

export interface DateRange {
  from?: Date;
  to?: Date;
}

export interface ExtinguisherDocument {
  _id: ObjectId;
  serialNumber: string;
  location: string;
  type: ExtinguisherType;
  size: ExtinguisherSize;
  installationDate: Date;
  expiryDate: Date;
  status: ExtinguisherStatus;
  createdBy: ObjectId;
  updatedBy?: ObjectId | null;
  isDeleted?: boolean;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface InspectionDocument {
  _id: ObjectId;
  extinguisherId: ObjectId;
  scheduledBy: ObjectId;
  assignedInspectorId: ObjectId;
  inspectionDate: Date;
  inspectionTime: string;
  status: InspectionStatus;
  result?: InspectionResult | null;
  findings?: string | null;
  completedAt?: Date | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MaintenanceDocument {
  _id: ObjectId;
  extinguisherId: ObjectId;
  inspectorId: ObjectId;
  actionTaken: string;
  maintenanceDate: Date;
  issuesIdentified: string;
  notesAndRecommendations?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReportMetric {
  label: string;
  count: number;
}

export interface ReportEntry {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExtinguisherReportEntry extends ReportEntry {
  serialNumber: string;
  location: string;
  type: ExtinguisherType;
  size: ExtinguisherSize;
  installationDate: Date;
  expiryDate: Date;
  status: ExtinguisherStatus;
}

export interface InspectionReportEntry extends ReportEntry {
  extinguisherId: string;
  assignedInspectorId: string;
  inspectionDate: Date;
  inspectionTime: string;
  status: InspectionStatus;
  result?: InspectionResult | null;
  findings?: string | null;
  completedAt?: Date | null;
  notes?: string | null;
}

export interface MaintenanceReportEntry extends ReportEntry {
  extinguisherId: string;
  inspectorId: string;
  actionTaken: string;
  maintenanceDate: Date;
  issuesIdentified: string;
  notesAndRecommendations?: string | null;
}

export interface DashboardReport {
  totalExtinguishers: number;
  activeExtinguishers: number;
  expiredExtinguishers: number;
  underMaintenance: number;
  pendingInspections: number;
  completedInspections: number;
  overdueInspections: number;
  upcomingExpirations: number;
  recentMaintenance: MaintenanceReportEntry[];
}

export interface InventoryReport {
  totalExtinguishers: number;
  byStatus: ReportMetric[];
  byType: ReportMetric[];
  byLocation: ReportMetric[];
  timeline: ReportMetric[];
}

export interface InspectionReport {
  totalInspections: number;
  byStatus: ReportMetric[];
  byResult: ReportMetric[];
  recentInspections: InspectionReportEntry[];
}

export interface ComplianceReport {
  totalExtinguishers: number;
  expiredExtinguishers: number;
  expiringWithin30Days: number;
  compliantExtinguishers: number;
  overdueInspections: number;
  upcomingExpirations: ExtinguisherReportEntry[];
}

export interface MaintenanceReport {
  totalMaintenanceLogs: number;
  byAction: ReportMetric[];
  frequencyByMonth: ReportMetric[];
  recentMaintenance: MaintenanceReportEntry[];
}

export interface ExportReport {
  format: ExportFormat;
  filename: string;
  generatedAt: string;
  sections: {
    dashboard: DashboardReport;
    inventory: InventoryReport;
    inspections: InspectionReport;
    compliance: ComplianceReport;
    maintenance: MaintenanceReport;
  };
  csv?: string;
}
