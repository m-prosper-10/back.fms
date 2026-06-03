import { NextFunction, Request, Response } from "express";

const hopByHopHeaders = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade"
]);

function buildTargetUrl(baseUrl: string, originalUrl: string) {
  return new URL(originalUrl, baseUrl).toString();
}

function copyRequestHeaders(req: Request) {
  const headers: Record<string, string> = {};

  for (const [key, value] of Object.entries(req.headers)) {
    if (value == null) {
      continue;
    }

    if (
      hopByHopHeaders.has(key.toLowerCase()) ||
      key.toLowerCase() === "host" ||
      key.toLowerCase() === "content-length"
    ) {
      continue;
    }

    headers[key] = Array.isArray(value) ? value.join(",") : String(value);
  }

  return headers;
}

export function createProxyHandler(targetBaseUrl: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const targetUrl = buildTargetUrl(targetBaseUrl, req.originalUrl);
      const headers = copyRequestHeaders(req);

      const method = req.method.toUpperCase();
      const init: RequestInit = {
        method,
        headers,
        redirect: "manual"
      };

      if (method !== "GET" && method !== "HEAD") {
        if (!headers["content-type"]) {
          headers["content-type"] = "application/json";
        }

        init.body = req.body && Object.keys(req.body).length > 0 ? JSON.stringify(req.body) : undefined;
      }

      const response = await fetch(targetUrl, init);

      res.status(response.status);

      response.headers.forEach((value, key) => {
        if (hopByHopHeaders.has(key.toLowerCase()) || key.toLowerCase() === "content-length") {
          return;
        }

        res.setHeader(key, value);
      });

      const body = await response.arrayBuffer();
      if (body.byteLength > 0) {
        res.send(Buffer.from(body));
        return;
      }

      res.end();
    } catch (error) {
      next(error);
    }
  };
}
