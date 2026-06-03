const { spawn } = require("child_process");
const net = require("net");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PORTS = [
  { host: "127.0.0.1", port: 27017, name: "mongodb" }
];

const SERVICES = [
  "dev:api-gateway",
  "dev:auth-service",
  "dev:user-service",
  "dev:extinguisher-service",
  "dev:inspection-service",
  "dev:reporting-service",
  "dev:notification-service"
];

const children = [];

process.env.MONGODB_URL = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/fms_backend";
process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "dev-access-secret";
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "dev-refresh-secret";
process.env.PASSWORD_RESET_TOKEN_SECRET = process.env.PASSWORD_RESET_TOKEN_SECRET || "dev-reset-secret";
process.env.AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || "http://localhost:4001";
process.env.USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://localhost:4002";
process.env.EXTINGUISHER_SERVICE_URL = process.env.EXTINGUISHER_SERVICE_URL || "http://localhost:4003";
process.env.INSPECTION_SERVICE_URL = process.env.INSPECTION_SERVICE_URL || "http://localhost:4004";
process.env.REPORTING_SERVICE_URL = process.env.REPORTING_SERVICE_URL || "http://localhost:4005";
process.env.NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || "http://localhost:4006";
process.env.TS_NODE_FILES = process.env.TS_NODE_FILES || "true";

function log(message) {
  process.stdout.write(`${message}\n`);
}

function run(command, args, options = {}) {
  const child = spawn(command, args, {
    cwd: ROOT,
    stdio: "inherit",
    shell: false,
    env: process.env,
    ...options
  });

  children.push(child);
  return child;
}

function waitForPort({ host, port, name }, timeoutMs = 120_000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();

    const attempt = () => {
      const socket = net.connect(port, host);

      socket.on("connect", () => {
        socket.end();
        resolve();
      });

      socket.on("error", () => {
        socket.destroy();
        if (Date.now() - start > timeoutMs) {
          reject(new Error(`Timed out waiting for ${name} on ${host}:${port}`));
          return;
        }

        setTimeout(attempt, 1000);
      });
    };

    attempt();
  });
}

function waitForUrl(url, timeoutMs = 120_000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();

    const attempt = async () => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          resolve();
          return;
        }
      } catch {
        // keep retrying
      }

      if (Date.now() - start > timeoutMs) {
        reject(new Error(`Timed out waiting for ${url}`));
        return;
      }

      setTimeout(attempt, 1000);
    };

    attempt();
  });
}

async function main() {
  for (const port of PORTS) {
    log(`Waiting for ${port.name} on ${port.host}:${port.port}...`);
    await waitForPort(port);
  }

  const redisPort = { host: "127.0.0.1", port: 6379, name: "redis" };
  waitForPort(redisPort, 1000).catch(() => {
    log("Redis is not available yet; continuing without blocking startup.");
  });

  log("Starting services...");
  for (const script of SERVICES) {
    run("npm", ["run", script]);
  }

  const readyChecks = [
    "http://localhost:4000/api/health",
    "http://localhost:4001/api/health",
    "http://localhost:4002/api/health",
    "http://localhost:4003/api/health",
    "http://localhost:4004/api/health",
    "http://localhost:4005/api/health",
    "http://localhost:4006/api/health"
  ];

  log("Waiting for service health checks...");
  for (const url of readyChecks) {
    log(`  ${url}`);
    await waitForUrl(url);
  }

  log("Backend stack is ready.");
  log("Gateway: http://localhost:4000");
}

function shutdown(signal) {
  log(`Received ${signal}; shutting down services...`);
  for (const child of children) {
    try {
      child.kill(signal);
    } catch {
      // ignore
    }
  }
  process.exit(0);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
