import { Router } from "express";
import swaggerUi from "swagger-ui-express";

export type OpenApiMethod = "get" | "post" | "put" | "patch" | "delete";

export interface OpenApiTag {
  name: string;
  description: string;
}

export interface OpenApiEndpoint {
  method: OpenApiMethod;
  path: string;
  summary: string;
  description?: string;
  tags: string[];
  secured?: boolean;
  parameters?: Array<{
    name: string;
    in: "path" | "query" | "header";
    required?: boolean;
    description?: string;
    schema: Record<string, unknown>;
  }>;
  requestBody?: {
    required?: boolean;
    description?: string;
    content: {
      "application/json": {
        schema: Record<string, unknown>;
        example?: unknown;
      };
    };
  };
}

export interface OpenApiSpecInput {
  title: string;
  description: string;
  version: string;
  serverUrl: string;
  tags: OpenApiTag[];
  endpoints: OpenApiEndpoint[];
}

export interface OpenApiDocument {
  openapi: "3.0.3";
  info: {
    title: string;
    description: string;
    version: string;
  };
  servers: Array<{
    url: string;
    description: string;
  }>;
  tags: OpenApiTag[];
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http";
        scheme: "bearer";
        bearerFormat: "JWT";
      };
    };
  };
  paths: Record<
    string,
    Partial<
      Record<
        OpenApiMethod,
        {
          summary: string;
          description?: string;
          tags: string[];
          security?: Array<{ bearerAuth: [] }>;
          parameters?: OpenApiEndpoint["parameters"];
          requestBody?: OpenApiEndpoint["requestBody"];
          responses: Record<string, { description: string }>;
        }
      >
    >
  >;
}

function toOpenApiPath(path: string) {
  return path.replace(/:([A-Za-z0-9_]+)/g, "{$1}");
}

export function buildOpenApiDocument(input: OpenApiSpecInput): OpenApiDocument {
  const paths: OpenApiDocument["paths"] = {};

  for (const endpoint of input.endpoints) {
    const path = toOpenApiPath(endpoint.path);
    const current = paths[path] ?? {};

    current[endpoint.method] = {
      summary: endpoint.summary,
      description: endpoint.description,
      tags: endpoint.tags,
      ...(endpoint.secured ? { security: [{ bearerAuth: [] }] } : {}),
      ...(endpoint.parameters ? { parameters: endpoint.parameters } : {}),
      ...(endpoint.requestBody ? { requestBody: endpoint.requestBody } : {}),
      responses: {
        "200": { description: "Success" },
        "201": { description: "Created" },
        "400": { description: "Bad request" },
        "401": { description: "Unauthorized" },
        "403": { description: "Forbidden" },
        "404": { description: "Not found" },
        "500": { description: "Server error" }
      }
    };

    paths[path] = current;
  }

  return {
    openapi: "3.0.3",
    info: {
      title: input.title,
      description: input.description,
      version: input.version
    },
    servers: [{ url: input.serverUrl, description: "Local development server" }],
    tags: input.tags,
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    paths
  };
}

export function createOpenApiRouter(document: OpenApiDocument) {
  const router = Router();

  router.get("/openapi.json", (_req, res) => {
    res.json(document);
  });

  router.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(document, {
      explorer: true,
      swaggerOptions: {
        docExpansion: "list",
        displayRequestDuration: true
      }
    })
  );

  return router;
}
