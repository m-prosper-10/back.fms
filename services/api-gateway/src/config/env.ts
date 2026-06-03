import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  APP_NAME: z.string().min(1).default("api-gateway"),
  ALLOWED_ORIGINS: z.string().default("http://localhost:5173"),
  MONGODB_URL: z.string().optional(),
  REDIS_URL: z.string().optional(),
  JWT_SECRET: z.string().optional(),
  AUTH_SERVICE_URL: z.string().default("http://localhost:4001"),
  USER_SERVICE_URL: z.string().default("http://localhost:4002"),
  EXTINGUISHER_SERVICE_URL: z.string().default("http://localhost:4003"),
  INSPECTION_SERVICE_URL: z.string().default("http://localhost:4004"),
  REPORTING_SERVICE_URL: z.string().default("http://localhost:4005"),
  NOTIFICATION_SERVICE_URL: z.string().default("http://localhost:4006")
});

const parsed = envSchema.parse(process.env);

export const env = {
  nodeEnv: parsed.NODE_ENV,
  port: parsed.PORT,
  appName: parsed.APP_NAME,
  allowedOrigins: parsed.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim()),
  services: {
    auth: parsed.AUTH_SERVICE_URL,
    users: parsed.USER_SERVICE_URL,
    extinguishers: parsed.EXTINGUISHER_SERVICE_URL,
    inspections: parsed.INSPECTION_SERVICE_URL,
    reports: parsed.REPORTING_SERVICE_URL,
    notifications: parsed.NOTIFICATION_SERVICE_URL
  },
  raw: parsed
};
