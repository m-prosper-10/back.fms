import { buildOpenApiDocument } from "../../../../shared/openapi/openapi";
import { env } from "../config/env";

const idParam = {
  name: "id",
  in: "path" as const,
  required: true,
  description: "MongoDB ObjectId",
  schema: { type: "string" }
};

const extinguisherIdParam = {
  name: "extinguisherId",
  in: "path" as const,
  required: true,
  description: "MongoDB ObjectId of the extinguisher",
  schema: { type: "string" }
};

const userIdParam = {
  name: "userId",
  in: "path" as const,
  required: true,
  description: "MongoDB ObjectId of the user",
  schema: { type: "string" }
};

const notificationTypeParam = {
  name: "type",
  in: "path" as const,
  required: true,
  description: "Notification type",
  schema: { type: "string", enum: ["inspection", "maintenance", "expiry", "system"] }
};

const statusParam = {
  name: "status",
  in: "path" as const,
  required: true,
  description: "Status value",
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

export const apiGatewayOpenApiDocument = buildOpenApiDocument({
  title: "FMS API Gateway",
  description: "Reverse-proxy entry point for all backend domain services.",
  version: "1.0.0",
  serverUrl: `http://localhost:${env.port}`,
  tags: [
    { name: "Gateway", description: "Gateway health and monitoring endpoints" },
    { name: "Auth", description: "Proxy endpoints for the auth service" },
    { name: "Users", description: "Proxy endpoints for the user service" },
    { name: "Extinguishers", description: "Proxy endpoints for the extinguisher service" },
    { name: "Inspections", description: "Proxy endpoints for the inspection service" },
    { name: "Maintenance", description: "Proxy endpoints for the maintenance domain" },
    { name: "Reports", description: "Proxy endpoints for the reporting service" },
    { name: "Notifications", description: "Proxy endpoints for the notification service" }
  ],
  endpoints: [
    { method: "get", path: "/api/health", summary: "Gateway health check", tags: ["Gateway"] },
    { method: "get", path: "/api/monitoring", summary: "Gateway monitoring status", tags: ["Gateway"] },
    { method: "get", path: "/metrics", summary: "Prometheus metrics endpoint", tags: ["Gateway"] },
    { method: "get", path: "/api/auth", summary: "Proxy auth service status", tags: ["Auth"] },
    {
      method: "post",
      path: "/api/auth/register",
      summary: "Proxy auth register",
      tags: ["Auth"],
      requestBody: jsonBody(
        {
          type: "object",
          required: ["firstName", "lastName", "email", "password"],
          properties: {
            firstName: { type: "string" },
            lastName: { type: "string" },
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 8 }
          }
        },
        {
          firstName: "Prosper",
          lastName: "Mugisha",
          email: "prosper@example.com",
          password: "StrongPass123"
        }
      )
    },
    {
      method: "post",
      path: "/api/auth/login",
      summary: "Proxy auth login",
      tags: ["Auth"],
      requestBody: jsonBody(
        {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string" }
          }
        },
        {
          email: "prosper@example.com",
          password: "StrongPass123"
        }
      )
    },
    {
      method: "post",
      path: "/api/auth/logout",
      summary: "Proxy auth logout",
      tags: ["Auth"],
      secured: true,
      requestBody: jsonBody(
        {
          type: "object",
          required: ["refreshToken"],
          properties: {
            refreshToken: { type: "string" }
          }
        },
        { refreshToken: "refresh-token-here" }
      )
    },
    {
      method: "post",
      path: "/api/auth/refresh-token",
      summary: "Proxy auth token refresh",
      tags: ["Auth"],
      requestBody: jsonBody(
        {
          type: "object",
          required: ["refreshToken"],
          properties: {
            refreshToken: { type: "string" }
          }
        },
        { refreshToken: "refresh-token-here" }
      )
    },
    {
      method: "post",
      path: "/api/auth/forgot-password",
      summary: "Proxy auth forgot password",
      tags: ["Auth"],
      requestBody: jsonBody(
        {
          type: "object",
          required: ["email"],
          properties: {
            email: { type: "string", format: "email" }
          }
        },
        { email: "prosper@example.com" }
      )
    },
    {
      method: "post",
      path: "/api/auth/reset-password",
      summary: "Proxy auth reset password",
      tags: ["Auth"],
      requestBody: jsonBody(
        {
          type: "object",
          required: ["resetToken", "password"],
          properties: {
            resetToken: { type: "string" },
            password: { type: "string", minLength: 8 }
          }
        },
        {
          resetToken: "reset-token-here",
          password: "StrongPass123"
        }
      )
    },
    {
      method: "get",
      path: "/api/auth/validate-token",
      summary: "Proxy auth token validation",
      tags: ["Auth"],
      secured: true,
      parameters: [
        {
          name: "Authorization",
          in: "header",
          required: true,
          description: 'Bearer token in the format "Bearer <accessToken>"',
          schema: { type: "string" }
        }
      ]
    },
    { method: "get", path: "/api/users/meta", summary: "Proxy user service metadata", tags: ["Users"], secured: true },
    {
      method: "post",
      path: "/api/users",
      summary: "Proxy create user",
      tags: ["Users"],
      secured: true,
      requestBody: jsonBody(
        {
          type: "object",
          required: ["firstName", "lastName", "email", "password", "role"],
          properties: {
            firstName: { type: "string" },
            lastName: { type: "string" },
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 8 },
            role: { type: "string", enum: ["admin", "inspector", "user"] },
            status: { type: "string", enum: ["active", "inactive", "suspended"], default: "active" }
          }
        },
        {
          firstName: "Prosper",
          lastName: "Mugisha",
          email: "prosper@example.com",
          password: "StrongPass123",
          role: "user",
          status: "active"
        }
      )
    },
    { method: "get", path: "/api/users/inspectors", summary: "Proxy list inspectors", tags: ["Users"], secured: true },
    { method: "get", path: "/api/users", summary: "Proxy list users", tags: ["Users"], secured: true },
    { method: "get", path: "/api/users/me", summary: "Proxy current user profile", tags: ["Users"], secured: true },
    {
      method: "patch",
      path: "/api/users/me",
      summary: "Proxy update current user profile",
      tags: ["Users"],
      secured: true,
      requestBody: jsonBody(
        {
          type: "object",
          properties: {
            firstName: { type: "string" },
            lastName: { type: "string" }
          }
        },
        {
          firstName: "Prosper",
          lastName: "Mugisha"
        }
      )
    },
    {
      method: "patch",
      path: "/api/users/change-password",
      summary: "Proxy change password",
      tags: ["Users"],
      secured: true,
      requestBody: jsonBody(
        {
          type: "object",
          required: ["currentPassword", "newPassword"],
          properties: {
            currentPassword: { type: "string" },
            newPassword: { type: "string", minLength: 8 }
          }
        },
        {
          currentPassword: "OldPass123",
          newPassword: "NewPass123"
        }
      )
    },
    {
      method: "get",
      path: "/api/users/:id",
      summary: "Proxy get user by id",
      tags: ["Users"],
      secured: true,
      parameters: [idParam]
    },
    {
      method: "patch",
      path: "/api/users/:id",
      summary: "Proxy update user by id",
      tags: ["Users"],
      secured: true,
      parameters: [idParam],
      requestBody: jsonBody(
        {
          type: "object",
          properties: {
            firstName: { type: "string" },
            lastName: { type: "string" }
          }
        },
        {
          firstName: "Prosper",
          lastName: "Mugisha"
        }
      )
    },
    {
      method: "delete",
      path: "/api/users/:id",
      summary: "Proxy delete user by id",
      tags: ["Users"],
      secured: true,
      parameters: [idParam]
    },
    {
      method: "patch",
      path: "/api/users/:id/role",
      summary: "Proxy update user role",
      tags: ["Users"],
      secured: true,
      parameters: [idParam],
      requestBody: jsonBody(
        {
          type: "object",
          required: ["role"],
          properties: {
            role: { type: "string", enum: ["admin", "inspector", "user"] }
          }
        },
        { role: "inspector" }
      )
    },
    {
      method: "patch",
      path: "/api/users/:id/status",
      summary: "Proxy update user status",
      tags: ["Users"],
      secured: true,
      parameters: [idParam],
      requestBody: jsonBody(
        {
          type: "object",
          required: ["status"],
          properties: {
            status: { type: "string", enum: ["active", "inactive", "suspended"] }
          }
        },
        { status: "active" }
      )
    },
    { method: "get", path: "/api/extinguishers/meta", summary: "Proxy extinguisher metadata", tags: ["Extinguishers"], secured: true },
    { method: "get", path: "/api/extinguishers", summary: "Proxy list extinguishers", tags: ["Extinguishers"], secured: true },
    {
      method: "get",
      path: "/api/extinguishers/:id",
      summary: "Proxy extinguisher details",
      tags: ["Extinguishers"],
      secured: true,
      parameters: [idParam]
    },
    {
      method: "post",
      path: "/api/extinguishers",
      summary: "Proxy create extinguisher",
      tags: ["Extinguishers"],
      secured: true,
      requestBody: jsonBody(
        {
          type: "object",
          required: ["serialNumber", "location", "type", "size", "installationDate", "expiryDate"],
          properties: {
            serialNumber: { type: "string" },
            location: { type: "string" },
            type: { type: "string", enum: ["Water", "CO2", "Foam", "Dry Chemical"] },
            size: { type: "string", enum: ["1.5 lb", "5 lb", "9 lb", "12 lb"] },
            installationDate: { type: "string", format: "date" },
            expiryDate: { type: "string", format: "date" }
          }
        },
        {
          serialNumber: "FX-10001",
          location: "Block A - Floor 1",
          type: "CO2",
          size: "5 lb",
          installationDate: "2026-01-01",
          expiryDate: "2027-01-01"
        }
      )
    },
    {
      method: "patch",
      path: "/api/extinguishers/:id",
      summary: "Proxy update extinguisher",
      tags: ["Extinguishers"],
      secured: true,
      parameters: [idParam],
      requestBody: jsonBody(
        {
          type: "object",
          properties: {
            serialNumber: { type: "string" },
            location: { type: "string" },
            type: { type: "string", enum: ["Water", "CO2", "Foam", "Dry Chemical"] },
            size: { type: "string", enum: ["1.5 lb", "5 lb", "9 lb", "12 lb"] },
            installationDate: { type: "string", format: "date" },
            expiryDate: { type: "string", format: "date" },
            status: { type: "string", enum: ["active", "expired", "maintenance", "decommissioned"] }
          }
        },
        {
          location: "Block A - Floor 2",
          status: "maintenance"
        }
      )
    },
    {
      method: "delete",
      path: "/api/extinguishers/:id",
      summary: "Proxy delete extinguisher",
      tags: ["Extinguishers"],
      secured: true,
      parameters: [idParam]
    },
    {
      method: "get",
      path: "/api/extinguishers/status/:status",
      summary: "Proxy extinguishers by status",
      tags: ["Extinguishers"],
      secured: true,
      parameters: [statusParam]
    },
    {
      method: "get",
      path: "/api/extinguishers/location/:location",
      summary: "Proxy extinguishers by location",
      tags: ["Extinguishers"],
      secured: true,
      parameters: [
        {
          name: "location",
          in: "path",
          required: true,
          description: "Location filter",
          schema: { type: "string" }
        }
      ]
    },
    { method: "get", path: "/api/inspections/meta", summary: "Proxy inspection metadata", tags: ["Inspections"], secured: true },
    {
      method: "post",
      path: "/api/inspections",
      summary: "Proxy schedule inspection",
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
    { method: "get", path: "/api/inspections", summary: "Proxy list inspections", tags: ["Inspections"], secured: true, parameters: rangeQueryParams },
    {
      method: "get",
      path: "/api/inspections/:id",
      summary: "Proxy inspection details",
      tags: ["Inspections"],
      secured: true,
      parameters: [idParam]
    },
    {
      method: "patch",
      path: "/api/inspections/:id",
      summary: "Proxy update inspection",
      tags: ["Inspections"],
      secured: true,
      parameters: [idParam],
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
      summary: "Proxy delete inspection",
      tags: ["Inspections"],
      secured: true,
      parameters: [idParam]
    },
    {
      method: "patch",
      path: "/api/inspections/:id/complete",
      summary: "Proxy complete inspection",
      tags: ["Inspections"],
      secured: true,
      parameters: [idParam],
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
      summary: "Proxy inspections by status",
      tags: ["Inspections"],
      secured: true,
      parameters: [statusParam]
    },
    {
      method: "get",
      path: "/api/inspections/overdue",
      summary: "Proxy overdue inspections",
      tags: ["Inspections"],
      secured: true,
      parameters: rangeQueryParams
    },
    {
      method: "get",
      path: "/api/inspections/extinguisher/:extinguisherId",
      summary: "Proxy inspections by extinguisher",
      tags: ["Inspections"],
      secured: true,
      parameters: [extinguisherIdParam, ...rangeQueryParams]
    },
    { method: "get", path: "/api/maintenance/meta", summary: "Proxy maintenance metadata", tags: ["Maintenance"], secured: true },
    {
      method: "post",
      path: "/api/maintenance",
      summary: "Proxy create maintenance log",
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
    { method: "get", path: "/api/maintenance", summary: "Proxy list maintenance logs", tags: ["Maintenance"], secured: true, parameters: rangeQueryParams },
    {
      method: "get",
      path: "/api/maintenance/:id",
      summary: "Proxy maintenance log details",
      tags: ["Maintenance"],
      secured: true,
      parameters: [idParam]
    },
    {
      method: "patch",
      path: "/api/maintenance/:id",
      summary: "Proxy update maintenance log",
      tags: ["Maintenance"],
      secured: true,
      parameters: [idParam],
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
      summary: "Proxy delete maintenance log",
      tags: ["Maintenance"],
      secured: true,
      parameters: [idParam]
    },
    {
      method: "get",
      path: "/api/maintenance/extinguisher/:extinguisherId",
      summary: "Proxy maintenance by extinguisher",
      tags: ["Maintenance"],
      secured: true,
      parameters: [extinguisherIdParam, ...rangeQueryParams]
    },
    { method: "get", path: "/api/reports/meta", summary: "Proxy report metadata", tags: ["Reports"], secured: true },
    { method: "get", path: "/api/reports/dashboard", summary: "Proxy dashboard report", tags: ["Reports"], secured: true },
    { method: "get", path: "/api/reports/inventory", summary: "Proxy inventory report", tags: ["Reports"], secured: true, parameters: rangeQueryParams },
    { method: "get", path: "/api/reports/inventory/daily", summary: "Proxy daily inventory report", tags: ["Reports"], secured: true, parameters: rangeQueryParams },
    { method: "get", path: "/api/reports/inventory/monthly", summary: "Proxy monthly inventory report", tags: ["Reports"], secured: true, parameters: rangeQueryParams },
    { method: "get", path: "/api/reports/inventory/yearly", summary: "Proxy yearly inventory report", tags: ["Reports"], secured: true, parameters: rangeQueryParams },
    { method: "get", path: "/api/reports/inspections", summary: "Proxy inspection report", tags: ["Reports"], secured: true, parameters: rangeQueryParams },
    { method: "get", path: "/api/reports/inspections/pending", summary: "Proxy pending inspections report", tags: ["Reports"], secured: true, parameters: rangeQueryParams },
    { method: "get", path: "/api/reports/inspections/completed", summary: "Proxy completed inspections report", tags: ["Reports"], secured: true, parameters: rangeQueryParams },
    { method: "get", path: "/api/reports/inspections/overdue", summary: "Proxy overdue inspections report", tags: ["Reports"], secured: true, parameters: rangeQueryParams },
    { method: "get", path: "/api/reports/compliance", summary: "Proxy compliance report", tags: ["Reports"], secured: true },
    { method: "get", path: "/api/reports/compliance/expired", summary: "Proxy expired compliance report", tags: ["Reports"], secured: true },
    { method: "get", path: "/api/reports/compliance/upcoming-expirations", summary: "Proxy upcoming expirations report", tags: ["Reports"], secured: true },
    { method: "get", path: "/api/reports/maintenance", summary: "Proxy maintenance report", tags: ["Reports"], secured: true, parameters: rangeQueryParams },
    { method: "get", path: "/api/reports/maintenance/history", summary: "Proxy maintenance history report", tags: ["Reports"], secured: true, parameters: rangeQueryParams },
    { method: "get", path: "/api/reports/maintenance/frequency", summary: "Proxy maintenance frequency report", tags: ["Reports"], secured: true, parameters: rangeQueryParams },
    { method: "get", path: "/api/reports/maintenance/recent", summary: "Proxy recent maintenance report", tags: ["Reports"], secured: true, parameters: rangeQueryParams },
    { method: "get", path: "/api/reports/export/pdf", summary: "Proxy export reports as PDF", tags: ["Reports"], secured: true },
    { method: "get", path: "/api/reports/export/csv", summary: "Proxy export reports as CSV", tags: ["Reports"], secured: true },
    { method: "get", path: "/api/notifications/meta", summary: "Proxy notification metadata", tags: ["Notifications"], secured: true },
    {
      method: "post",
      path: "/api/notifications/send",
      summary: "Proxy send notification",
      tags: ["Notifications"],
      secured: true,
      requestBody: jsonBody(
        {
          type: "object",
          required: ["userId", "title", "message", "type"],
          properties: {
            userId: { type: "string" },
            title: { type: "string" },
            message: { type: "string" },
            type: { type: "string", enum: ["inspection", "maintenance", "expiry", "system"] }
          }
        },
        {
          userId: "user-id",
          title: "Inspection Due",
          message: "Your fire extinguisher inspection is scheduled for tomorrow.",
          type: "inspection"
        }
      )
    },
    { method: "get", path: "/api/notifications", summary: "Proxy list notifications", tags: ["Notifications"], secured: true },
    {
      method: "get",
      path: "/api/notifications/:id",
      summary: "Proxy notification details",
      tags: ["Notifications"],
      secured: true,
      parameters: [idParam]
    },
    {
      method: "patch",
      path: "/api/notifications/:id/read",
      summary: "Proxy mark notification as read",
      tags: ["Notifications"],
      secured: true,
      parameters: [idParam]
    },
    {
      method: "patch",
      path: "/api/notifications/:id",
      summary: "Proxy update notification",
      tags: ["Notifications"],
      secured: true,
      parameters: [idParam],
      requestBody: jsonBody(
        {
          type: "object",
          properties: {
            title: { type: "string" },
            message: { type: "string" },
            type: { type: "string", enum: ["inspection", "maintenance", "expiry", "system"] },
            isRead: { type: "boolean" }
          }
        },
        {
          title: "Updated Notification",
          isRead: true
        }
      )
    },
    {
      method: "delete",
      path: "/api/notifications/:id",
      summary: "Proxy delete notification",
      tags: ["Notifications"],
      secured: true,
      parameters: [idParam]
    },
    {
      method: "get",
      path: "/api/notifications/type/:type",
      summary: "Proxy notifications by type",
      tags: ["Notifications"],
      secured: true,
      parameters: [notificationTypeParam]
    },
    {
      method: "get",
      path: "/api/notifications/user/:userId",
      summary: "Proxy notifications by user",
      tags: ["Notifications"],
      secured: true,
      parameters: [userIdParam]
    }
  ]
});
