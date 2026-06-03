import { Collection, Db, MongoClient, ObjectId } from "mongodb";
import { AppError } from "../../../../shared/lib/httpError";
import { logger } from "../../../../shared/lib/logger";
import { env } from "./env";
import { ExtinguisherDocument } from "../modules/extinguishers/extinguisher.types";

let client: MongoClient | null = null;
let database: Db | null = null;

export interface ExtinguisherCollections {
  extinguishers: Collection<ExtinguisherDocument>;
}

export async function connectExtinguisherDatabase() {
  if (database) {
    return database;
  }

  client = new MongoClient(env.raw.MONGODB_URL);
  await client.connect();
  database = client.db();

  await Promise.all([
    database
      .collection<ExtinguisherDocument>("fire_extinguishers")
      .createIndex({ serialNumber: 1 }, { unique: true }),
    database.collection<ExtinguisherDocument>("fire_extinguishers").createIndex({ status: 1 }),
    database.collection<ExtinguisherDocument>("fire_extinguishers").createIndex({ location: 1 }),
    database.collection<ExtinguisherDocument>("fire_extinguishers").createIndex({ expiryDate: 1 }),
    database.collection<ExtinguisherDocument>("fire_extinguishers").createIndex({ type: 1 })
  ]);

  logger.info(`Connected to MongoDB database ${database.databaseName}`);
  return database;
}

export function getExtinguisherDatabase() {
  if (!database) {
    throw new AppError(500, "Extinguisher database is not connected");
  }

  return database;
}

export function getExtinguisherCollections(): ExtinguisherCollections {
  const db = getExtinguisherDatabase();

  return {
    extinguishers: db.collection<ExtinguisherDocument>("fire_extinguishers")
  };
}

export async function closeExtinguisherDatabase() {
  await client?.close();
  client = null;
  database = null;
}

export function toObjectId(id: string) {
  return new ObjectId(id);
}
