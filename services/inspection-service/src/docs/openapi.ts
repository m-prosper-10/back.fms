import { buildOpenApiDocument } from "../../../../shared/openapi/openapi";
import { env } from "../config/env";

const inspectionIdParam = {
  name: "id",
  in: "path" as const,
  required: true,
  description: "MongoDB ObjectId of the inspection",
  schema: { type: "string" }
};

const maintenanceIdParam = {
  name: "id",
  in: "path" as const,
  required: true,
  description: "MongoDB ObjectId of the maintenance log",
  schema: { type: "string" }
};

const extinguisherIdParam = {
  name: "extinguisherId",
  in: "path" as const,
  required: true,
  description: "MongoDB ObjectId of the extinguisher",
  schema: { type: "string" }
};

const rangeQueryParams = [
  { name: "from", in: "query" as const, required: false, description: "Start date filter", schema: { type: "string", format: "date" } },
  { name: "to", in: "query" as const, required: false, description: "End date filter", schema: { type: "string", format: "date" } }
];

function jsonBody(schema: Record<string, unknown>, example: unknown) {
  return {
    required: true,
    content: {
      "application/json": {
        schema,
        example
      }
    }
  };
}

export const inspectionOpenApiDocument = buildOpenApiDocument({
  title: "FMS Inspection Service",
  description: "Inspection scheduling and maintenance logging service.",
  version: "1.0.0",
  serverUrl: `http://localhost:${env.port}`,
  tags: [
    { name: "Health", description: "Service health endpoint" },
    { name: "Inspections", description: "Inspection workflow endpoints" },
    { name: "Maintenance", description: "Maintenance log endpoints" }
  ],
  endpoints: [
    { method: "get", path: "/api/health", summary: "Service health check", tags: ["Health"] },
    { method: "get", path: "/api/inspections/meta", summary: "Inspection module status", tags: ["Inspections"], secured: true },
    {
      method: "post",
      path: "/api/inspections",
      summary: "Schedule an inspection",
      tags: ["Inspections"],
      secured: true,
      requestBody: jsonBody(
        {
          type: "object",
          required: ["extinguisherId", "inspectionDate", "inspectionTime", "assignedInspectorId"],
          properties: {
            extinguisherId: { type: "string" },
            inspectionDate: { type: "string", format: "date" },
            inspectionTime: { type: "string", pattern: "^\\d{2}:\\d{2}$" },
            assignedInspectorId: { type: "string" },
            notes: { type: "string" }
          }
        },
        {
          extinguisherId: "extinguisher-id",
          inspectionDate: "2026-06-10",
          inspectionTime: "10:30",
          assignedInspectorId: "inspector-id",
          notes: "Monthly routine inspection"
        }
      )
    },
    {
      method: "get",
      path: "/api/inspections",
      summary: "List inspections",
      tags: ["Inspections"],
      secured: true,
      parameters: rangeQueryParams
    },
    {
      method: "get",
      path: "/api/inspections/:id",
      summary: "Get inspection by id",
      tags: ["Inspections"],
      secured: true,
      parameters: [inspectionIdParam]
    },
    {
      method: "patch",
      path: "/api/inspections/:id",
      summary: "Update an inspection",
      tags: ["Inspections"],
      secured: true,
      parameters: [inspectionIdParam],
      requestBody: jsonBody(
        {
          type: "object",
          properties: {
            extinguisherId: { type: "string" },
            inspectionDate: { type: "string", format: "date" },
            inspectionTime: { type: "string", pattern: "^\\d{2}:\\d{2}$" },
            assignedInspectorId: { type: "string" },
            status: { type: "string", enum: ["pending", "completed", "overdue", "cancelled"] },
            result: { type: "string", enum: ["passed", "failed", "requires_maintenance"] },
            findings: { type: "string" },
            notes: { type: "string" }
          }
        },
        {
          status: "completed",
          result: "passed"
        }
      )
    },
    {
      method: "delete",
      path: "/api/inspections/:id",
      summary: "Delete an inspection",
      tags: ["Inspections"],
      secured: true,
      parameters: [inspectionIdParam]
    },
    {
      method: "patch",
      path: "/api/inspections/:id/complete",
      summary: "Complete an inspection",
      tags: ["Inspections"],
      secured: true,
      parameters: [inspectionIdParam],
      requestBody: jsonBody(
        {
          type: "object",
          required: ["result"],
          properties: {
            result: { type: "string", enum: ["passed", "failed", "requires_maintenance"] },
            findings: { type: "string" },
            notes: { type: "string" }
          }
        },
        {
          result: "passed",
          findings: "Unit is in good condition",
          notes: "No action required"
        }
      )
    },
    {
      method: "get",
      path: "/api/inspections/status/:status",
      summary: "List inspections by status",
      tags: ["Inspections"],
      secured: true,
      parameters: [
        {
          name: "status",
          in: "path",
          required: true,
          description: "Inspection status",
          schema: { type: "string", enum: ["pending", "completed", "overdue", "cancelled"] }
        }
      ]
    },
    {
      method: "get",
      path: "/api/inspections/overdue",
      summary: "List overdue inspections",
      tags: ["Inspections"],
      secured: true,
      parameters: rangeQueryParams
    },
    {
      method: "get",
      path: "/api/inspections/extinguisher/:extinguisherId",
      summary: "List inspections by extinguisher",
      tags: ["Inspections"],
      secured: true,
      parameters: [extinguisherIdParam, ...rangeQueryParams]
    },
    { method: "get", path: "/api/maintenance/meta", summary: "Maintenance module status", tags: ["Maintenance"], secured: true },
    {
      method: "post",
      path: "/api/maintenance",
      summary: "Create a maintenance log",
      tags: ["Maintenance"],
      secured: true,
      requestBody: jsonBody(
        {
          type: "object",
          required: ["extinguisherId", "actionTaken", "maintenanceDate", "issuesIdentified"],
          properties: {
            extinguisherId: { type: "string" },
            actionTaken: { type: "string" },
            maintenanceDate: { type: "string", format: "date" },
            issuesIdentified: { type: "string" },
            notesAndRecommendations: { type: "string" }
          }
        },
        {
          extinguisherId: "extinguisher-id",
          actionTaken: "Replaced pressure valve",
          maintenanceDate: "2026-06-03",
          issuesIdentified: "Low pressure",
          notesAndRecommendations: "Recheck after 30 days"
        }
      )
    },
    { method: "get", path: "/api/maintenance", summary: "List maintenance logs", tags: ["Maintenance"], secured: true, parameters: rangeQueryParams },
    {
      method: "get",
      path: "/api/maintenance/:id",
      summary: "Get maintenance log by id",
      tags: ["Maintenance"],
      secured: true,
      parameters: [maintenanceIdParam]
    },
    {
      method: "patch",
      path: "/api/maintenance/:id",
      summary: "Update a maintenance log",
      tags: ["Maintenance"],
      secured: true,
      parameters: [maintenanceIdParam],
      requestBody: jsonBody(
        {
          type: "object",
          properties: {
            extinguisherId: { type: "string" },
            actionTaken: { type: "string" },
            maintenanceDate: { type: "string", format: "date" },
            issuesIdentified: { type: "string" },
            notesAndRecommendations: { type: "string" }
          }
        },
        {
          actionTaken: "Serviced pressure gauge"
        }
      )
    },
    {
      method: "delete",
      path: "/api/maintenance/:id",
      summary: "Delete a maintenance log",
      tags: ["Maintenance"],
      secured: true,
      parameters: [maintenanceIdParam]
    },
    {
      method: "get",
      path: "/api/maintenance/extinguisher/:extinguisherId",
      summary: "List maintenance logs by extinguisher",
      tags: ["Maintenance"],
      secured: true,
      parameters: [extinguisherIdParam, ...rangeQueryParams]
    }
  ]
});
