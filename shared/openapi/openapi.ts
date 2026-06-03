import { Router } from "express";

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

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderSpecPage(document: OpenApiDocument) {
  const json = JSON.stringify(document, null, 2);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(document.info.title)} - API Docs</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f7f7f4;
      --panel: #ffffff;
      --text: #1f2937;
      --muted: #6b7280;
      --accent: #0f766e;
      --border: #e5e7eb;
    }
    body {
      margin: 0;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: var(--bg);
      color: var(--text);
    }
    .wrap {
      max-width: 1180px;
      margin: 0 auto;
      padding: 32px 20px 48px;
    }
    .hero {
      background: linear-gradient(135deg, #0f172a, #134e4a);
      color: white;
      border-radius: 20px;
      padding: 28px;
      margin-bottom: 24px;
      box-shadow: 0 24px 60px rgba(15, 23, 42, 0.18);
    }
    .hero h1 { margin: 0 0 8px; font-size: 2rem; }
    .hero p { margin: 0; color: rgba(255,255,255,0.8); line-height: 1.5; }
    .meta {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 18px;
    }
    .pill {
      background: rgba(255,255,255,0.12);
      border: 1px solid rgba(255,255,255,0.16);
      border-radius: 999px;
      padding: 6px 12px;
      font-size: 0.9rem;
    }
    .panel {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 20px;
      box-shadow: 0 12px 30px rgba(15, 23, 42, 0.05);
      margin-bottom: 20px;
    }
    .links a {
      color: var(--accent);
      text-decoration: none;
      font-weight: 600;
    }
    .grid {
      display: grid;
      gap: 12px;
    }
    .endpoint {
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 14px 16px;
      background: #fff;
    }
    .endpoint-head {
      display: flex;
      gap: 10px;
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: 8px;
    }
    .method {
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.08em;
      border-radius: 999px;
      padding: 4px 9px;
      color: white;
      background: var(--accent);
    }
    .path {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-weight: 700;
    }
    .tags {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .tag {
      border-radius: 999px;
      padding: 3px 8px;
      border: 1px solid var(--border);
      color: var(--muted);
      font-size: 0.8rem;
    }
    pre {
      overflow: auto;
      background: #0b1020;
      color: #d1d5db;
      padding: 18px;
      border-radius: 14px;
      border: 1px solid #111827;
    }
    .muted { color: var(--muted); }
  </style>
</head>
<body>
  <div class="wrap">
    <section class="hero">
      <h1>${escapeHtml(document.info.title)}</h1>
      <p>${escapeHtml(document.info.description)}</p>
      <div class="meta">
        <span class="pill">OpenAPI ${escapeHtml(document.openapi)}</span>
        <span class="pill">Version ${escapeHtml(document.info.version)}</span>
        <span class="pill">Server ${escapeHtml(document.servers[0]?.url ?? "")}</span>
      </div>
    </section>

    <section class="panel">
      <div class="links">
        <a href="./openapi.json" target="_blank" rel="noreferrer">Open raw OpenAPI JSON</a>
      </div>
      <p class="muted">This page renders the service contract without extra Swagger dependencies.</p>
    </section>

    <section class="panel">
      <h2>Endpoints</h2>
      <div class="grid" id="endpoints"></div>
    </section>

    <section class="panel">
      <h2>Spec</h2>
      <pre>${escapeHtml(json)}</pre>
    </section>
  </div>
  <script>
    const documentSpec = ${JSON.stringify(document)};
    const container = document.getElementById("endpoints");
    const methods = ["get", "post", "put", "patch", "delete"];
    const methodColors = {
      get: "#0f766e",
      post: "#2563eb",
      put: "#7c3aed",
      patch: "#d97706",
      delete: "#dc2626"
    };

    Object.entries(documentSpec.paths).forEach(([path, ops]) => {
      methods.forEach((method) => {
        const op = ops[method];
        if (!op) return;
        const section = document.createElement("div");
        section.className = "endpoint";
        section.innerHTML =
          '<div class="endpoint-head">' +
            '<span class="method" style="background:' + methodColors[method] + '">' + method.toUpperCase() + "</span>" +
            '<span class="path">' + path + "</span>" +
          "</div>" +
          "<div>" + op.summary + "</div>" +
          '<div class="tags">' + op.tags.map((tag) => '<span class="tag">' + tag + "</span>").join("") + "</div>" +
          (op.security ? '<div class="muted" style="margin-top:8px;">Bearer JWT required</div>' : "");
        container.appendChild(section);
      });
    });
  </script>
</body>
</html>`;
}

export function createOpenApiRouter(document: OpenApiDocument) {
  const router = Router();

  router.get("/openapi.json", (_req, res) => {
    res.json(document);
  });

  router.get("/api-docs", (_req, res) => {
    res.type("html").send(renderSpecPage(document));
  });

  return router;
}
