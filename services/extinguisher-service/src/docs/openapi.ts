import { buildOpenApiDocument } from "../../../../shared/openapi/openapi";
import { env } from "../config/env";

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
    { method: "get", path: "/api/extinguishers/:id", summary: "Get extinguisher by id", tags: ["Extinguishers"], secured: true },
    { method: "post", path: "/api/extinguishers", summary: "Create a new extinguisher", tags: ["Extinguishers"], secured: true },
    { method: "patch", path: "/api/extinguishers/:id", summary: "Update an extinguisher", tags: ["Extinguishers"], secured: true },
    { method: "delete", path: "/api/extinguishers/:id", summary: "Delete an extinguisher", tags: ["Extinguishers"], secured: true },
    { method: "get", path: "/api/extinguishers/status/:status", summary: "List extinguishers by status", tags: ["Extinguishers"], secured: true },
    { method: "get", path: "/api/extinguishers/location/:location", summary: "List extinguishers by location", tags: ["Extinguishers"], secured: true }
  ]
});
