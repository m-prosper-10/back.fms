import { Collection, Db, MongoClient, ObjectId } from "mongodb";
import { AppError } from "../../../shared/lib/httpError";
import { logger } from "../../../shared/lib/logger";
import { env } from "./env";
import { UserDocument } from "../modules/users/user.types";

let client: MongoClient | null = null;
let database: Db | null = null;

export interface UserCollections {
  users: Collection<UserDocument>;
}

export async function connectUserDatabase() {
  if (database) {
    return database;
  }

  client = new MongoClient(env.raw.MONGODB_URL);
  await client.connect();
  database = client.db();

  await Promise.all([
    database.collection<UserDocument>("users").createIndex({ email: 1 }, { unique: true }),
    database.collection<UserDocument>("users").createIndex({ role: 1 }),
    database.collection<UserDocument>("users").createIndex({ status: 1 })
  ]);

  logger.info(`Connected to MongoDB database ${database.databaseName}`);
  return database;
}

export function getUserDatabase() {
  if (!database) {
    throw new AppError(500, "User database is not connected");
  }

  return database;
}

export function getUserCollections(): UserCollections {
  const db = getUserDatabase();

  return {
    users: db.collection<UserDocument>("users")
  };
}

export async function closeUserDatabase() {
  await client?.close();
  client = null;
  database = null;
}

export function toObjectId(id: string) {
  return new ObjectId(id);
}
