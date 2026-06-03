import { ObjectId } from "mongodb";
import { getInspectionCollections } from "../../config/database";
import {
  InspectionDocument,
  InspectionStatus,
  MaintenanceDocument,
  PublicInspection,
  PublicMaintenance
} from "./inspection.types";

function collections() {
  return getInspectionCollections();
}

function toPublicInspection(doc: InspectionDocument): PublicInspection {
  return {
    id: doc._id.toHexString(),
    extinguisherId: doc.extinguisherId.toHexString(),
    scheduledBy: doc.scheduledBy.toHexString(),
    assignedInspectorId: doc.assignedInspectorId.toHexString(),
    inspectionDate: doc.inspectionDate,
    inspectionTime: doc.inspectionTime,
    status: doc.status,
    result: doc.result ?? null,
    findings: doc.findings ?? null,
    completedAt: doc.completedAt ?? null,
    notes: doc.notes ?? null,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  };
}

function toPublicMaintenance(doc: MaintenanceDocument): PublicMaintenance {
  return {
    id: doc._id.toHexString(),
    extinguisherId: doc.extinguisherId.toHexString(),
    inspectorId: doc.inspectorId.toHexString(),
    actionTaken: doc.actionTaken,
    maintenanceDate: doc.maintenanceDate,
    issuesIdentified: doc.issuesIdentified,
    notesAndRecommendations: doc.notesAndRecommendations ?? null,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  };
}

export async function createInspection(doc: Omit<InspectionDocument, "_id">) {
  const result = await collections().inspections.insertOne({
    ...doc,
    _id: new ObjectId()
  });

  return result.insertedId ? findInspectionById(result.insertedId) : null;
}

export async function findInspectionById(id: ObjectId) {
  const document = await collections().inspections.findOne({ _id: id });
  return document ? toPublicInspection(document) : null;
}

export async function listInspections() {
  const documents = await collections().inspections.find({}).sort({ inspectionDate: 1 }).toArray();
  return documents.map(toPublicInspection);
}

export async function listInspectionsByStatus(status: InspectionStatus) {
  const documents = await collections().inspections.find({ status }).sort({ inspectionDate: 1 }).toArray();
  return documents.map(toPublicInspection);
}

export async function listInspectionsByExtinguisher(extinguisherId: ObjectId) {
  const documents = await collections().inspections.find({ extinguisherId }).sort({ inspectionDate: 1 }).toArray();
  return documents.map(toPublicInspection);
}

export async function listOverdueInspections() {
  const documents = await collections()
    .inspections.find({
      $or: [
        { status: "pending", inspectionDate: { $lt: new Date() } },
        { status: "overdue" }
      ]
    })
    .sort({ inspectionDate: 1 })
    .toArray();

  return documents.map((doc) => toPublicInspection({ ...doc, status: "overdue" }));
}

export async function updateInspection(
  id: ObjectId,
  payload: Partial<InspectionDocument>
) {
  await collections().inspections.updateOne(
    { _id: id },
    {
      $set: {
        ...payload,
        updatedAt: new Date()
      }
    }
  );

  return findInspectionById(id);
}

export async function deleteInspection(id: ObjectId) {
  const document = await collections().inspections.findOne({ _id: id });
  if (!document) {
    return null;
  }

  await collections().inspections.deleteOne({ _id: id });
  return toPublicInspection(document);
}

export async function createMaintenanceLog(doc: Omit<MaintenanceDocument, "_id">) {
  const result = await collections().maintenanceLogs.insertOne({
    ...doc,
    _id: new ObjectId()
  });

  return result.insertedId ? findMaintenanceById(result.insertedId) : null;
}

export async function findMaintenanceById(id: ObjectId) {
  const document = await collections().maintenanceLogs.findOne({ _id: id });
  return document ? toPublicMaintenance(document) : null;
}

export async function listMaintenanceLogs() {
  const documents = await collections().maintenanceLogs.find({}).sort({ maintenanceDate: -1 }).toArray();
  return documents.map(toPublicMaintenance);
}

export async function listMaintenanceLogsByExtinguisher(extinguisherId: ObjectId) {
  const documents = await collections().maintenanceLogs.find({ extinguisherId }).sort({ maintenanceDate: -1 }).toArray();
  return documents.map(toPublicMaintenance);
}

export async function updateMaintenanceLog(id: ObjectId, payload: Partial<MaintenanceDocument>) {
  await collections().maintenanceLogs.updateOne(
    { _id: id },
    {
      $set: {
        ...payload,
        updatedAt: new Date()
      }
    }
  );

  return findMaintenanceById(id);
}

export async function deleteMaintenanceLog(id: ObjectId) {
  const document = await collections().maintenanceLogs.findOne({ _id: id });
  if (!document) {
    return null;
  }

  await collections().maintenanceLogs.deleteOne({ _id: id });
  return toPublicMaintenance(document);
}
