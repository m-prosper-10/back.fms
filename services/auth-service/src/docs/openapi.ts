import { buildOpenApiDocument } from "../../../../shared/openapi/openapi";
import { env } from "../config/env";

const emailSchema = { type: "string", format: "email" };
const passwordSchema = {
  type: "string",
  minLength: 8,
  description: "Must include upper-case, lower-case, and numeric characters"
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
    {
      method: "post",
      path: "/api/auth/register",
      summary: "Register a new account",
      tags: ["Auth"],
      requestBody: jsonBody(
        {
          type: "object",
          required: ["firstName", "lastName", "email", "password"],
          properties: {
            firstName: { type: "string" },
            lastName: { type: "string" },
            email: emailSchema,
            password: passwordSchema
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
      summary: "Authenticate a user",
      tags: ["Auth"],
      requestBody: jsonBody(
        {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: emailSchema,
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
      summary: "Invalidate the current refresh token",
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
        {
          refreshToken: "refresh-token-here"
        }
      )
    },
    {
      method: "post",
      path: "/api/auth/refresh-token",
      summary: "Exchange a refresh token for a new access token",
      tags: ["Auth"],
      requestBody: jsonBody(
        {
          type: "object",
          required: ["refreshToken"],
          properties: {
            refreshToken: { type: "string" }
          }
        },
        {
          refreshToken: "refresh-token-here"
        }
      )
    },
    {
      method: "post",
      path: "/api/auth/forgot-password",
      summary: "Create a password reset token",
      tags: ["Auth"],
      requestBody: jsonBody(
        {
          type: "object",
          required: ["email"],
          properties: {
            email: emailSchema
          }
        },
        {
          email: "prosper@example.com"
        }
      )
    },
    {
      method: "post",
      path: "/api/auth/reset-password",
      summary: "Reset the account password",
      tags: ["Auth"],
      requestBody: jsonBody(
        {
          type: "object",
          required: ["resetToken", "password"],
          properties: {
            resetToken: { type: "string" },
            password: passwordSchema
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
      summary: "Validate the active access token",
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
    }
  ]
});
