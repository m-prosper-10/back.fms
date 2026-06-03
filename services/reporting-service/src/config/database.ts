import { Collection, Db, MongoClient } from "mongodb";
import { AppError } from "../../../../shared/lib/httpError";
import { logger } from "../../../../shared/lib/logger";
import { env } from "./env";
import {
  ExtinguisherDocument,
  InspectionDocument,
  MaintenanceDocument
} from "../modules/reports/report.types";

let client: MongoClient | null = null;
let database: Db | null = null;

export interface ReportingCollections {
  fireExtinguishers: Collection<ExtinguisherDocument>;
  inspections: Collection<InspectionDocument>;
  maintenanceLogs: Collection<MaintenanceDocument>;
}

export async function connectReportingDatabase() {
  if (database) {
    return database;
  }

  client = new MongoClient(env.raw.MONGODB_URL);
  await client.connect();
  database = client.db();

  await Promise.all([
    database.collection<ExtinguisherDocument>("fire_extinguishers").createIndex({ serialNumber: 1 }, { unique: true }),
    database.collection<ExtinguisherDocument>("fire_extinguishers").createIndex({ status: 1 }),
    database.collection<ExtinguisherDocument>("fire_extinguishers").createIndex({ location: 1 }),
    database.collection<ExtinguisherDocument>("fire_extinguishers").createIndex({ type: 1 }),
    database.collection<ExtinguisherDocument>("fire_extinguishers").createIndex({ expiryDate: 1 }),
    database.collection<ExtinguisherDocument>("fire_extinguishers").createIndex({ createdAt: 1 }),
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

export function getReportingDatabase() {
  if (!database) {
    throw new AppError(500, "Reporting database is not connected");
  }

  return database;
}

export function getReportingCollections(): ReportingCollections {
  const db = getReportingDatabase();

  return {
    fireExtinguishers: db.collection<ExtinguisherDocument>("fire_extinguishers"),
    inspections: db.collection<InspectionDocument>("inspections"),
    maintenanceLogs: db.collection<MaintenanceDocument>("maintenance_logs")
  };
}

export async function closeReportingDatabase() {
  await client?.close();
  client = null;
  database = null;
}
