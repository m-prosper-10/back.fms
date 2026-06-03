import { z } from "zod";

const inspectionStatuses = ["pending", "completed", "overdue", "cancelled"] as const;
const inspectionResults = ["passed", "failed", "requires_maintenance"] as const;

export const scheduleInspectionSchema = z.object({
  extinguisherId: z.string().min(1, "Extinguisher id is required"),
  inspectionDate: z.coerce.date(),
  inspectionTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Inspection time must be in HH:MM format"),
  assignedInspectorId: z.string().min(1, "Assigned inspector id is required"),
  notes: z.string().optional()
});

export const updateInspectionSchema = z
  .object({
    extinguisherId: z.string().min(1).optional(),
    inspectionDate: z.coerce.date().optional(),
    inspectionTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
    assignedInspectorId: z.string().min(1).optional(),
    status: z.enum(inspectionStatuses).optional(),
    result: z.enum(inspectionResults).optional(),
    findings: z.string().optional(),
    notes: z.string().optional()
  })
  .refine(
    (data) => {
      if (data.inspectionDate && data.inspectionDate < new Date()) {
        return false;
      }

      return true;
    },
    {
      message: "Inspection date cannot be in the past",
      path: ["inspectionDate"]
    }
  );

export const completeInspectionSchema = z.object({
  result: z.enum(inspectionResults),
  findings: z.string().optional(),
  notes: z.string().optional()
});

export const inspectionStatusParamSchema = z.object({
  status: z.enum(inspectionStatuses)
});

export const inspectionIdParamSchema = z.object({
  id: z.string().min(1, "Inspection id is required")
});

export const extinguisherIdParamSchema = z.object({
  extinguisherId: z.string().min(1, "Extinguisher id is required")
});

export const maintenanceRequestSchema = z.object({
  extinguisherId: z.string().min(1, "Extinguisher id is required"),
  actionTaken: z.string().min(1, "Action taken is required"),
  maintenanceDate: z.coerce.date(),
  issuesIdentified: z.string().min(1, "Issues identified is required"),
  notesAndRecommendations: z.string().optional()
});

export const maintenanceUpdateSchema = z.object({
  extinguisherId: z.string().min(1).optional(),
  actionTaken: z.string().min(1).optional(),
  maintenanceDate: z.coerce.date().optional(),
  issuesIdentified: z.string().min(1).optional(),
  notesAndRecommendations: z.string().optional()
});

export const maintenanceIdParamSchema = z.object({
  id: z.string().min(1, "Maintenance id is required")
});

export const maintenanceExtinguisherParamSchema = z.object({
  extinguisherId: z.string().min(1, "Extinguisher id is required")
});
