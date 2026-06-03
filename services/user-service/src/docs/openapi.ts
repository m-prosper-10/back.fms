import { buildOpenApiDocument } from "../../../../shared/openapi/openapi";
import { env } from "../config/env";

const userIdParam = {
  name: "id",
  in: "path" as const,
  required: true,
  description: "MongoDB ObjectId of the user",
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
    {
      method: "post",
      path: "/api/users",
      summary: "Create a new user",
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
    { method: "get", path: "/api/users/inspectors", summary: "List available inspectors", tags: ["Users"], secured: true },
    { method: "get", path: "/api/users", summary: "List users", tags: ["Users"], secured: true },
    { method: "get", path: "/api/users/me", summary: "Get the current user profile", tags: ["Users"], secured: true },
    {
      method: "patch",
      path: "/api/users/me",
      summary: "Update the current user profile",
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
      summary: "Change the current user password",
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
      summary: "Get a user by id",
      tags: ["Users"],
      secured: true,
      parameters: [userIdParam]
    },
    {
      method: "patch",
      path: "/api/users/:id",
      summary: "Update a user by id",
      tags: ["Users"],
      secured: true,
      parameters: [userIdParam],
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
      summary: "Delete a user by id",
      tags: ["Users"],
      secured: true,
      parameters: [userIdParam]
    },
    {
      method: "patch",
      path: "/api/users/:id/role",
      summary: "Update a user role",
      tags: ["Users"],
      secured: true,
      parameters: [userIdParam],
      requestBody: jsonBody(
        {
          type: "object",
          required: ["role"],
          properties: {
            role: { type: "string", enum: ["admin", "inspector", "user"] }
          }
        },
        {
          role: "inspector"
        }
      )
    },
    {
      method: "patch",
      path: "/api/users/:id/status",
      summary: "Update a user status",
      tags: ["Users"],
      secured: true,
      parameters: [userIdParam],
      requestBody: jsonBody(
        {
          type: "object",
          required: ["status"],
          properties: {
            status: { type: "string", enum: ["active", "inactive", "suspended"] }
          }
        },
        {
          status: "active"
        }
      )
    }
  ]
});
