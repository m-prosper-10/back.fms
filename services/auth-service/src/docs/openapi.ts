import { buildOpenApiDocument } from "../../../../shared/openapi/openapi";
import { env } from "../config/env";

export const authOpenApiDocument = buildOpenApiDocument({
  title: "FMS Auth Service",
  description: "Authentication and token management service.",
  version: "1.0.0",
  serverUrl: `http://localhost:${env.port}`,
  tags: [
    { name: "Health", description: "Service health endpoint" },
    { name: "Auth", description: "Authentication and token endpoints" }
  ],
  endpoints: [
    { method: "get", path: "/api/health", summary: "Service health check", tags: ["Health"] },
    { method: "get", path: "/api/auth", summary: "Auth module status", tags: ["Auth"] },
    { method: "post", path: "/api/auth/register", summary: "Register a new account", tags: ["Auth"] },
    { method: "post", path: "/api/auth/login", summary: "Authenticate a user", tags: ["Auth"] },
    { method: "post", path: "/api/auth/logout", summary: "Invalidate the current refresh token", tags: ["Auth"], secured: true },
    { method: "post", path: "/api/auth/refresh-token", summary: "Exchange a refresh token for a new access token", tags: ["Auth"] },
    { method: "post", path: "/api/auth/forgot-password", summary: "Create a password reset token", tags: ["Auth"] },
    { method: "post", path: "/api/auth/reset-password", summary: "Reset the account password", tags: ["Auth"] },
    { method: "get", path: "/api/auth/validate-token", summary: "Validate the active access token", tags: ["Auth"], secured: true }
  ]
});
