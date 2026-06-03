import { Collection, Db, MongoClient, ObjectId } from "mongodb";
import { AppError } from "../../../../shared/lib/httpError";
import { logger } from "../../../../shared/lib/logger";
import { env } from "./env";
import {
  AuthUserDocument,
  PasswordResetTokenDocument,
  RefreshTokenDocument
} from "../modules/auth/auth.types";

let client: MongoClient | null = null;
let database: Db | null = null;

export interface AuthCollections {
  users: Collection<AuthUserDocument>;
  refreshTokens: Collection<RefreshTokenDocument>;
  passwordResetTokens: Collection<PasswordResetTokenDocument>;
}

export async function connectAuthDatabase() {
  if (database) {
    return database;
  }

  client = new MongoClient(env.raw.MONGODB_URL);
  await client.connect();
  database = client.db();

  await Promise.all([
    database.collection<AuthUserDocument>("users").createIndex({ email: 1 }, { unique: true }),
    database
      .collection<RefreshTokenDocument>("refresh_tokens")
      .createIndex({ tokenHash: 1 }, { unique: true }),
    database
      .collection<RefreshTokenDocument>("refresh_tokens")
      .createIndex({ userId: 1, revokedAt: 1, expiresAt: 1 }),
    database
      .collection<PasswordResetTokenDocument>("password_reset_tokens")
      .createIndex({ tokenHash: 1 }, { unique: true }),
    database
      .collection<PasswordResetTokenDocument>("password_reset_tokens")
      .createIndex({ userId: 1, usedAt: 1, revokedAt: 1, expiresAt: 1 })
  ]);

  logger.info(`Connected to MongoDB database ${database.databaseName}`);
  return database;
}

export function getAuthDatabase() {
  if (!database) {
    throw new AppError(500, "Auth database is not connected");
  }

  return database;
}

export function getAuthCollections(): AuthCollections {
  const db = getAuthDatabase();

  return {
    users: db.collection<AuthUserDocument>("users"),
    refreshTokens: db.collection<RefreshTokenDocument>("refresh_tokens"),
    passwordResetTokens: db.collection<PasswordResetTokenDocument>("password_reset_tokens")
  };
}

export async function closeAuthDatabase() {
  await client?.close();
  client = null;
  database = null;
}

export function toObjectId(id: string) {
  return new ObjectId(id);
}
