import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4004),
  APP_NAME: z.string().min(1).default("inspection-service"),
  ALLOWED_ORIGINS: z.string().default("http://localhost:5173"),
  MONGODB_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(1)
});

const parsed = envSchema.parse(process.env);

export const env = {
  nodeEnv: parsed.NODE_ENV,
  port: parsed.PORT,
  appName: parsed.APP_NAME,
  allowedOrigins: parsed.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim()),
  raw: parsed
};
