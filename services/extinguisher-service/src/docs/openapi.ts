import { buildOpenApiDocument } from "../../../../shared/openapi/openapi";
import { env } from "../config/env";

const idParam = {
  name: "id",
  in: "path" as const,
  required: true,
  description: "MongoDB ObjectId of the extinguisher",
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

export const extinguisherOpenApiDocument = buildOpenApiDocument({
  title: "FMS Extinguisher Service",
  description: "Fire extinguisher inventory and lifecycle service.",
  version: "1.0.0",
  serverUrl: `http://localhost:${env.port}`,
  tags: [
    { name: "Health", description: "Service health endpoint" },
    { name: "Extinguishers", description: "Extinguisher inventory endpoints" }
  ],
  endpoints: [
    { method: "get", path: "/api/health", summary: "Service health check", tags: ["Health"] },
    { method: "get", path: "/api/extinguishers/meta", summary: "Extinguisher module status", tags: ["Extinguishers"], secured: true },
    { method: "get", path: "/api/extinguishers", summary: "List extinguishers", tags: ["Extinguishers"], secured: true },
    {
      method: "get",
      path: "/api/extinguishers/:id",
      summary: "Get extinguisher by id",
      tags: ["Extinguishers"],
      secured: true,
      parameters: [idParam]
    },
    {
      method: "post",
      path: "/api/extinguishers",
      summary: "Create a new extinguisher",
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
      summary: "Update an extinguisher",
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
      summary: "Delete an extinguisher",
      tags: ["Extinguishers"],
      secured: true,
      parameters: [idParam]
    },
    {
      method: "get",
      path: "/api/extinguishers/status/:status",
      summary: "List extinguishers by status",
      tags: ["Extinguishers"],
      secured: true,
      parameters: [
        {
          name: "status",
          in: "path",
          required: true,
          description: "Extinguisher status",
          schema: { type: "string", enum: ["active", "expired", "maintenance", "decommissioned"] }
        }
      ]
    },
    {
      method: "get",
      path: "/api/extinguishers/location/:location",
      summary: "List extinguishers by location",
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
    }
  ]
});
