import { Collection, Db, MongoClient, ObjectId } from "mongodb";
import { AppError } from "../../../../shared/lib/httpError";
import { logger } from "../../../../shared/lib/logger";
import { env } from "./env";
import { NotificationDocument } from "../modules/notifications/notification.types";

let client: MongoClient | null = null;
let database: Db | null = null;

export interface NotificationCollections {
  notifications: Collection<NotificationDocument>;
}

export async function connectNotificationDatabase() {
  if (database) {
    return database;
  }

  client = new MongoClient(env.raw.MONGODB_URL);
  await client.connect();
  database = client.db();

  await Promise.all([
    database.collection<NotificationDocument>("notifications").createIndex({ userId: 1 }),
    database.collection<NotificationDocument>("notifications").createIndex({ isRead: 1 }),
    database.collection<NotificationDocument>("notifications").createIndex({ type: 1 }),
    database.collection<NotificationDocument>("notifications").createIndex({ createdAt: -1 })
  ]);

  logger.info(`Connected to MongoDB database ${database.databaseName}`);
  return database;
}

export function getNotificationDatabase() {
  if (!database) {
    throw new AppError(500, "Notification database is not connected");
  }

  return database;
}

export function getNotificationCollections(): NotificationCollections {
  const db = getNotificationDatabase();

  return {
    notifications: db.collection<NotificationDocument>("notifications")
  };
}

export async function closeNotificationDatabase() {
  await client?.close();
  client = null;
  database = null;
}

export function toObjectId(id: string) {
  return new ObjectId(id);
}
