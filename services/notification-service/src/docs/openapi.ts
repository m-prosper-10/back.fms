import { buildOpenApiDocument } from "../../../../shared/openapi/openapi";
import { env } from "../config/env";

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
    { method: "post", path: "/api/notifications/send", summary: "Send a notification", tags: ["Notifications"], secured: true },
    { method: "get", path: "/api/notifications", summary: "List notifications", tags: ["Notifications"], secured: true },
    { method: "get", path: "/api/notifications/:id", summary: "Get notification by id", tags: ["Notifications"], secured: true },
    { method: "patch", path: "/api/notifications/:id/read", summary: "Mark a notification as read", tags: ["Notifications"], secured: true },
    { method: "patch", path: "/api/notifications/:id", summary: "Update a notification", tags: ["Notifications"], secured: true },
    { method: "delete", path: "/api/notifications/:id", summary: "Delete a notification", tags: ["Notifications"], secured: true },
    { method: "get", path: "/api/notifications/type/:type", summary: "List notifications by type", tags: ["Notifications"], secured: true },
    { method: "get", path: "/api/notifications/user/:userId", summary: "List notifications by user", tags: ["Notifications"], secured: true }
  ]
});
