import { buildOpenApiDocument } from "../../../../shared/openapi/openapi";
import { env } from "../config/env";

const notificationIdParam = {
  name: "id",
  in: "path" as const,
  required: true,
  description: "MongoDB ObjectId of the notification",
  schema: { type: "string" }
};

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

export const notificationOpenApiDocument = buildOpenApiDocument({
  title: "FMS Notification Service",
  description: "Notification inbox and delivery endpoints.",
  version: "1.0.0",
  serverUrl: `http://localhost:${env.port}`,
  tags: [
    { name: "Health", description: "Service health endpoint" },
    { name: "Notifications", description: "Notification management endpoints" }
  ],
  endpoints: [
    { method: "get", path: "/api/health", summary: "Service health check", tags: ["Health"] },
    { method: "get", path: "/api/notifications/meta", summary: "Notification module status", tags: ["Notifications"], secured: true },
    {
      method: "post",
      path: "/api/notifications/send",
      summary: "Send a notification",
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
    { method: "get", path: "/api/notifications", summary: "List notifications", tags: ["Notifications"], secured: true },
    {
      method: "get",
      path: "/api/notifications/:id",
      summary: "Get notification by id",
      tags: ["Notifications"],
      secured: true,
      parameters: [notificationIdParam]
    },
    {
      method: "patch",
      path: "/api/notifications/:id/read",
      summary: "Mark a notification as read",
      tags: ["Notifications"],
      secured: true,
      parameters: [notificationIdParam]
    },
    {
      method: "patch",
      path: "/api/notifications/:id",
      summary: "Update a notification",
      tags: ["Notifications"],
      secured: true,
      parameters: [notificationIdParam],
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
      summary: "Delete a notification",
      tags: ["Notifications"],
      secured: true,
      parameters: [notificationIdParam]
    },
    {
      method: "get",
      path: "/api/notifications/type/:type",
      summary: "List notifications by type",
      tags: ["Notifications"],
      secured: true,
      parameters: [
        {
          name: "type",
          in: "path",
          required: true,
          description: "Notification type",
          schema: { type: "string", enum: ["inspection", "maintenance", "expiry", "system"] }
        }
      ]
    },
    {
      method: "get",
      path: "/api/notifications/user/:userId",
      summary: "List notifications by user",
      tags: ["Notifications"],
      secured: true,
      parameters: [
        {
          name: "userId",
          in: "path",
          required: true,
          description: "MongoDB ObjectId of the user",
          schema: { type: "string" }
        }
      ]
    }
  ]
});
