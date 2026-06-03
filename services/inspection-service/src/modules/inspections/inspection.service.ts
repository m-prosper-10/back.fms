import { AppError } from "../../../../../shared/lib/httpError";
import { env } from "../../config/env";
import { toObjectId } from "../../config/database";
import {
  createInspection,
  createMaintenanceLog,
  deleteInspection,
  deleteMaintenanceLog,
  findInspectionById,
  findMaintenanceById,
  listInspections,
  listInspectionsByExtinguisher,
  listInspectionsByStatus,
  listMaintenanceLogs,
  listMaintenanceLogsByExtinguisher,
  listOverdueInspections,
  updateInspection,
  updateMaintenanceLog
} from "./inspection.repository";
import {
  InspectionResult,
  InspectionStatus,
  UserRole
} from "./inspection.types";

export interface ScheduleInspectionInput {
  extinguisherId: string;
  inspectionDate: Date;
  inspectionTime: string;
  assignedInspectorId: string;
  notes?: string;
}

export interface UpdateInspectionInput {
  extinguisherId?: string;
  inspectionDate?: Date;
  inspectionTime?: string;
  assignedInspectorId?: string;
  status?: InspectionStatus;
  result?: InspectionResult;
  findings?: string;
  notes?: string;
}

export interface CompleteInspectionInput {
  result: InspectionResult;
  findings?: string;
  notes?: string;
}

export interface CreateMaintenanceInput {
  extinguisherId: string;
  actionTaken: string;
  maintenanceDate: Date;
  issuesIdentified: string;
  notesAndRecommendations?: string;
}

export interface UpdateMaintenanceInput {
  extinguisherId?: string;
  actionTaken?: string;
  maintenanceDate?: Date;
  issuesIdentified?: string;
  notesAndRecommendations?: string;
}

function canSchedule(role: UserRole) {
  return role === "admin" || role === "user";
}

function canManage(role: UserRole) {
  return role === "admin" || role === "inspector";
}

function canComplete(role: UserRole) {
  return role === "admin" || role === "inspector";
}

function canView(role: UserRole) {
  return role === "admin" || role === "inspector" || role === "user";
}

function ensureSchedulePermission(role: UserRole) {
  if (!canSchedule(role)) {
    throw new AppError(403, "Forbidden");
  }
}

function ensureManagePermission(role: UserRole) {
  if (!canManage(role)) {
    throw new AppError(403, "Forbidden");
  }
}

function ensureCompletePermission(role: UserRole) {
  if (!canComplete(role)) {
    throw new AppError(403, "Forbidden");
  }
}

function ensureViewPermission(role: UserRole) {
  if (!canView(role)) {
    throw new AppError(403, "Forbidden");
  }
}

type NotificationPayload = {
  userId: string;
  title: string;
  message: string;
  type: "inspection" | "maintenance" | "expiry" | "system";
};

async function pushNotification(payload: NotificationPayload) {
  try {
    const response = await fetch(`${env.notificationServiceUrl}/api/notifications/internal/send`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-internal-token": env.internalServiceToken
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export const inspectionService = {
  async schedule(input: ScheduleInspectionInput, scheduledBy: string, role: UserRole) {
    ensureSchedulePermission(role);

    if (input.inspectionDate < new Date(new Date().toDateString())) {
      throw new AppError(400, "Inspection date cannot be in the past");
    }

    const now = new Date();
    const created = await createInspection({
      extinguisherId: toObjectId(input.extinguisherId),
      scheduledBy: toObjectId(scheduledBy),
      assignedInspectorId: toObjectId(input.assignedInspectorId),
      inspectionDate: input.inspectionDate,
      inspectionTime: input.inspectionTime,
      status: "pending",
      result: null,
      findings: null,
      completedAt: null,
      notes: input.notes ?? null,
      createdAt: now,
      updatedAt: now
    });

    if (!created) {
      throw new AppError(500, "Failed to create inspection");
    }

    void pushNotification({
      userId: input.assignedInspectorId,
      title: "New inspection assigned",
      message: `An inspection has been scheduled for extinguisher ${input.extinguisherId} on ${input.inspectionDate.toISOString().slice(0, 10)} at ${input.inspectionTime}.`,
      type: "inspection"
    });

    if (scheduledBy !== input.assignedInspectorId) {
      void pushNotification({
        userId: scheduledBy,
        title: "Inspection scheduled",
        message: `Your inspection request for extinguisher ${input.extinguisherId} has been scheduled.`,
        type: "inspection"
      });
    }

    return created;
  },

  async list(role: UserRole) {
    ensureViewPermission(role);
    return listInspections();
  },

  async getById(id: string, role: UserRole) {
    ensureViewPermission(role);
    const inspection = await findInspectionById(toObjectId(id));

    if (!inspection) {
      throw new AppError(404, "Inspection not found");
    }

    return inspection;
  },

  async update(id: string, input: UpdateInspectionInput, role: UserRole) {
    ensureManagePermission(role);

    if (input.inspectionDate && input.inspectionDate < new Date(new Date().toDateString())) {
      throw new AppError(400, "Inspection date cannot be in the past");
    }

    const updated = await updateInspection(toObjectId(id), {
      ...(input.extinguisherId ? { extinguisherId: toObjectId(input.extinguisherId) } : {}),
      ...(input.inspectionDate ? { inspectionDate: input.inspectionDate } : {}),
      ...(input.inspectionTime ? { inspectionTime: input.inspectionTime } : {}),
      ...(input.assignedInspectorId ? { assignedInspectorId: toObjectId(input.assignedInspectorId) } : {}),
      ...(input.status ? { status: input.status } : {}),
      ...(input.result ? { result: input.result } : {}),
      ...(input.findings ? { findings: input.findings } : {}),
      ...(input.notes ? { notes: input.notes } : {})
    });

    if (!updated) {
      throw new AppError(404, "Inspection not found");
    }

    return updated;
  },

  async remove(id: string, role: UserRole) {
    ensureManagePermission(role);
    const deleted = await deleteInspection(toObjectId(id));

    if (!deleted) {
      throw new AppError(404, "Inspection not found");
    }

    return deleted;
  },

  async complete(id: string, input: CompleteInspectionInput, role: UserRole) {
    ensureCompletePermission(role);

    const inspection = await findInspectionById(toObjectId(id));
    if (!inspection) {
      throw new AppError(404, "Inspection not found");
    }

    const updated = await updateInspection(toObjectId(id), {
      result: input.result,
      findings: input.findings ?? null,
      notes: input.notes ?? inspection.notes ?? null,
      status: "completed",
      completedAt: new Date()
    });

    if (!updated) {
      throw new AppError(404, "Inspection not found");
    }

    void pushNotification({
      userId: String(inspection.scheduledBy),
      title: "Inspection completed",
      message: `Inspection ${id} has been completed with result ${input.result}.`,
      type: "inspection"
    });

    return updated;
  },

  async byStatus(status: InspectionStatus, role: UserRole) {
    ensureViewPermission(role);
    return listInspectionsByStatus(status);
  },

  async overdue(role: UserRole) {
    ensureViewPermission(role);
    return listOverdueInspections();
  },

  async byExtinguisher(extinguisherId: string, role: UserRole) {
    ensureViewPermission(role);
    return listInspectionsByExtinguisher(toObjectId(extinguisherId));
  },

  async createMaintenance(input: CreateMaintenanceInput, inspectorId: string, role: UserRole) {
    ensureManagePermission(role);

    const now = new Date();
    const created = await createMaintenanceLog({
      extinguisherId: toObjectId(input.extinguisherId),
      inspectorId: toObjectId(inspectorId),
      actionTaken: input.actionTaken,
      maintenanceDate: input.maintenanceDate,
      issuesIdentified: input.issuesIdentified,
      notesAndRecommendations: input.notesAndRecommendations ?? null,
      createdAt: now,
      updatedAt: now
    });

    if (!created) {
      throw new AppError(500, "Failed to create maintenance log");
    }

    const relatedInspections = await listInspectionsByExtinguisher(toObjectId(input.extinguisherId));
    const latestInspection = relatedInspections[relatedInspections.length - 1];

    if (latestInspection) {
      void pushNotification({
        userId: latestInspection.scheduledBy,
        title: "Maintenance recorded",
        message: `Maintenance was logged for extinguisher ${input.extinguisherId}: ${input.actionTaken}.`,
        type: "maintenance"
      });
    }

    return created;
  },

  async listMaintenance(role: UserRole) {
    ensureViewPermission(role);
    return listMaintenanceLogs();
  },

  async getMaintenanceById(id: string, role: UserRole) {
    ensureViewPermission(role);
    const maintenance = await findMaintenanceById(toObjectId(id));

    if (!maintenance) {
      throw new AppError(404, "Maintenance log not found");
    }

    return maintenance;
  },

  async maintenanceByExtinguisher(extinguisherId: string, role: UserRole) {
    ensureViewPermission(role);
    return listMaintenanceLogsByExtinguisher(toObjectId(extinguisherId));
  },

  async updateMaintenance(id: string, input: UpdateMaintenanceInput, role: UserRole) {
    ensureManagePermission(role);
    const updated = await updateMaintenanceLog(toObjectId(id), {
      ...(input.extinguisherId ? { extinguisherId: toObjectId(input.extinguisherId) } : {}),
      ...(input.actionTaken ? { actionTaken: input.actionTaken } : {}),
      ...(input.maintenanceDate ? { maintenanceDate: input.maintenanceDate } : {}),
      ...(input.issuesIdentified ? { issuesIdentified: input.issuesIdentified } : {}),
      ...(input.notesAndRecommendations ? { notesAndRecommendations: input.notesAndRecommendations } : {})
    });

    if (!updated) {
      throw new AppError(404, "Maintenance log not found");
    }

    return updated;
  },

  async removeMaintenance(id: string, role: UserRole) {
    ensureManagePermission(role);
    const deleted = await deleteMaintenanceLog(toObjectId(id));

    if (!deleted) {
      throw new AppError(404, "Maintenance log not found");
    }

    return deleted;
  }
};
