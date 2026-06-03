import { buildOpenApiDocument } from "../../../../shared/openapi/openapi";
import { env } from "../config/env";

export const userOpenApiDocument = buildOpenApiDocument({
  title: "FMS User Service",
  description: "User profile and access management service.",
  version: "1.0.0",
  serverUrl: `http://localhost:${env.port}`,
  tags: [
    { name: "Health", description: "Service health endpoint" },
    { name: "Users", description: "User profile and administration endpoints" }
  ],
  endpoints: [
    { method: "get", path: "/api/health", summary: "Service health check", tags: ["Health"] },
    { method: "get", path: "/api/users/meta", summary: "User module status", tags: ["Users"], secured: true },
    { method: "post", path: "/api/users", summary: "Create a new user", tags: ["Users"], secured: true },
    { method: "get", path: "/api/users/inspectors", summary: "List available inspectors", tags: ["Users"], secured: true },
    { method: "get", path: "/api/users", summary: "List users", tags: ["Users"], secured: true },
    { method: "get", path: "/api/users/me", summary: "Get the current user profile", tags: ["Users"], secured: true },
    { method: "patch", path: "/api/users/me", summary: "Update the current user profile", tags: ["Users"], secured: true },
    { method: "patch", path: "/api/users/change-password", summary: "Change the current user password", tags: ["Users"], secured: true },
    { method: "get", path: "/api/users/:id", summary: "Get a user by id", tags: ["Users"], secured: true },
    { method: "patch", path: "/api/users/:id", summary: "Update a user by id", tags: ["Users"], secured: true },
    { method: "delete", path: "/api/users/:id", summary: "Delete a user by id", tags: ["Users"], secured: true },
    { method: "patch", path: "/api/users/:id/role", summary: "Update a user role", tags: ["Users"], secured: true },
    { method: "patch", path: "/api/users/:id/status", summary: "Update a user status", tags: ["Users"], secured: true }
  ]
});
