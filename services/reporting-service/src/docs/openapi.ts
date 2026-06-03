import { buildOpenApiDocument } from "../../../../shared/openapi/openapi";
import { env } from "../config/env";

const rangeQueryParams = [
  { name: "from", in: "query" as const, required: false, description: "Start date filter", schema: { type: "string", format: "date" } },
  { name: "to", in: "query" as const, required: false, description: "End date filter", schema: { type: "string", format: "date" } }
];

export const reportingOpenApiDocument = buildOpenApiDocument({
  title: "FMS Reporting Service",
  description: "Read-only analytics, reports, and export endpoints.",
  version: "1.0.0",
  serverUrl: `http://localhost:${env.port}`,
  tags: [
    { name: "Health", description: "Service health endpoint" },
    { name: "Reports", description: "Dashboard and reporting endpoints" }
  ],
  endpoints: [
    { method: "get", path: "/api/health", summary: "Service health check", tags: ["Health"] },
    { method: "get", path: "/api/reports/meta", summary: "Report module status", tags: ["Reports"], secured: true },
    { method: "get", path: "/api/reports", summary: "Report module status alias", tags: ["Reports"], secured: true },
    { method: "get", path: "/api/reports/dashboard", summary: "Dashboard report", tags: ["Reports"], secured: true },
    { method: "get", path: "/api/reports/inventory", summary: "Inventory report", tags: ["Reports"], secured: true, parameters: rangeQueryParams },
    { method: "get", path: "/api/reports/inventory/daily", summary: "Daily inventory report", tags: ["Reports"], secured: true, parameters: rangeQueryParams },
    { method: "get", path: "/api/reports/inventory/monthly", summary: "Monthly inventory report", tags: ["Reports"], secured: true, parameters: rangeQueryParams },
    { method: "get", path: "/api/reports/inventory/yearly", summary: "Yearly inventory report", tags: ["Reports"], secured: true, parameters: rangeQueryParams },
    { method: "get", path: "/api/reports/inspections", summary: "Inspection report", tags: ["Reports"], secured: true, parameters: rangeQueryParams },
    { method: "get", path: "/api/reports/inspections/pending", summary: "Pending inspections report", tags: ["Reports"], secured: true, parameters: rangeQueryParams },
    { method: "get", path: "/api/reports/inspections/completed", summary: "Completed inspections report", tags: ["Reports"], secured: true, parameters: rangeQueryParams },
    { method: "get", path: "/api/reports/inspections/overdue", summary: "Overdue inspections report", tags: ["Reports"], secured: true, parameters: rangeQueryParams },
    { method: "get", path: "/api/reports/compliance", summary: "Compliance report", tags: ["Reports"], secured: true },
    { method: "get", path: "/api/reports/compliance/expired", summary: "Expired compliance report", tags: ["Reports"], secured: true },
    { method: "get", path: "/api/reports/compliance/upcoming-expirations", summary: "Upcoming expiration report", tags: ["Reports"], secured: true },
    { method: "get", path: "/api/reports/maintenance", summary: "Maintenance report", tags: ["Reports"], secured: true, parameters: rangeQueryParams },
    { method: "get", path: "/api/reports/maintenance/history", summary: "Maintenance history report", tags: ["Reports"], secured: true, parameters: rangeQueryParams },
    { method: "get", path: "/api/reports/maintenance/frequency", summary: "Maintenance frequency report", tags: ["Reports"], secured: true, parameters: rangeQueryParams },
    { method: "get", path: "/api/reports/maintenance/recent", summary: "Recent maintenance report", tags: ["Reports"], secured: true, parameters: rangeQueryParams },
    { method: "get", path: "/api/reports/export/pdf", summary: "Export report as PDF", tags: ["Reports"], secured: true },
    { method: "get", path: "/api/reports/export/csv", summary: "Export report as CSV", tags: ["Reports"], secured: true }
  ]
});
