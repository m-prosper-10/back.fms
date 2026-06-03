import { buildOpenApiDocument } from "../../../../shared/openapi/openapi";
import { env } from "../config/env";

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
    { method: "post", path: "/api/inspections", summary: "Schedule an inspection", tags: ["Inspections"], secured: true },
    { method: "get", path: "/api/inspections", summary: "List inspections", tags: ["Inspections"], secured: true },
    { method: "get", path: "/api/inspections/:id", summary: "Get inspection by id", tags: ["Inspections"], secured: true },
    { method: "patch", path: "/api/inspections/:id", summary: "Update an inspection", tags: ["Inspections"], secured: true },
    { method: "delete", path: "/api/inspections/:id", summary: "Delete an inspection", tags: ["Inspections"], secured: true },
    { method: "patch", path: "/api/inspections/:id/complete", summary: "Complete an inspection", tags: ["Inspections"], secured: true },
    { method: "get", path: "/api/inspections/status/:status", summary: "List inspections by status", tags: ["Inspections"], secured: true },
    { method: "get", path: "/api/inspections/overdue", summary: "List overdue inspections", tags: ["Inspections"], secured: true },
    { method: "get", path: "/api/inspections/extinguisher/:extinguisherId", summary: "List inspections by extinguisher", tags: ["Inspections"], secured: true },
    { method: "get", path: "/api/maintenance/meta", summary: "Maintenance module status", tags: ["Maintenance"], secured: true },
    { method: "post", path: "/api/maintenance", summary: "Create a maintenance log", tags: ["Maintenance"], secured: true },
    { method: "get", path: "/api/maintenance", summary: "List maintenance logs", tags: ["Maintenance"], secured: true },
    { method: "get", path: "/api/maintenance/:id", summary: "Get maintenance log by id", tags: ["Maintenance"], secured: true },
    { method: "patch", path: "/api/maintenance/:id", summary: "Update a maintenance log", tags: ["Maintenance"], secured: true },
    { method: "delete", path: "/api/maintenance/:id", summary: "Delete a maintenance log", tags: ["Maintenance"], secured: true },
    { method: "get", path: "/api/maintenance/extinguisher/:extinguisherId", summary: "List maintenance logs by extinguisher", tags: ["Maintenance"], secured: true }
  ]
});
