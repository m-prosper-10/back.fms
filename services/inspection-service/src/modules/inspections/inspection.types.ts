import { ObjectId } from "mongodb";

export type UserRole = "admin" | "inspector" | "user";
export type UserStatus = "active" | "inactive" | "suspended";
export type InspectionStatus = "pending" | "completed" | "overdue" | "cancelled";
export type InspectionResult = "passed" | "failed" | "requires_maintenance";

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

export interface PublicInspection {
  id: string;
  extinguisherId: string;
  scheduledBy: string;
  assignedInspectorId: string;
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

export interface PublicMaintenance {
  id: string;
  extinguisherId: string;
  inspectorId: string;
  actionTaken: string;
  maintenanceDate: Date;
  issuesIdentified: string;
  notesAndRecommendations?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
