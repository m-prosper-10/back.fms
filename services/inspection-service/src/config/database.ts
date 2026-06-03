import { Collection, Db, MongoClient, ObjectId } from "mongodb";
import { AppError } from "../../../../shared/lib/httpError";
import { logger } from "../../../../shared/lib/logger";
import { env } from "./env";
import {
  InspectionDocument,
  MaintenanceDocument
} from "../modules/inspections/inspection.types";

let client: MongoClient | null = null;
let database: Db | null = null;

export interface InspectionCollections {
  inspections: Collection<InspectionDocument>;
  maintenanceLogs: Collection<MaintenanceDocument>;
}

export async function connectInspectionDatabase() {
  if (database) {
    return database;
  }

  client = new MongoClient(env.raw.MONGODB_URL);
  await client.connect();
  database = client.db();

  await Promise.all([
    database.collection<InspectionDocument>("inspections").createIndex({ extinguisherId: 1 }),
    database.collection<InspectionDocument>("inspections").createIndex({ assignedInspectorId: 1 }),
    database.collection<InspectionDocument>("inspections").createIndex({ status: 1 }),
    database.collection<InspectionDocument>("inspections").createIndex({ inspectionDate: 1 }),
    database.collection<MaintenanceDocument>("maintenance_logs").createIndex({ extinguisherId: 1 }),
    database.collection<MaintenanceDocument>("maintenance_logs").createIndex({ inspectorId: 1 }),
    database.collection<MaintenanceDocument>("maintenance_logs").createIndex({ maintenanceDate: 1 })
  ]);

  logger.info(`Connected to MongoDB database ${database.databaseName}`);
  return database;
}

export function getInspectionDatabase() {
  if (!database) {
    throw new AppError(500, "Inspection database is not connected");
  }

  return database;
}

export function getInspectionCollections(): InspectionCollections {
  const db = getInspectionDatabase();

  return {
    inspections: db.collection<InspectionDocument>("inspections"),
    maintenanceLogs: db.collection<MaintenanceDocument>("maintenance_logs")
  };
}

export async function closeInspectionDatabase() {
  await client?.close();
  client = null;
  database = null;
}

export function toObjectId(id: string) {
  return new ObjectId(id);
}
