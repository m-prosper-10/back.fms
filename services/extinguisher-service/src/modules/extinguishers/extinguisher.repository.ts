import { ObjectId } from "mongodb";
import { getExtinguisherCollections } from "../../config/database";
import {
  ExtinguisherDocument,
  ExtinguisherStatus,
  PublicExtinguisher
} from "./extinguisher.types";

function collections() {
  return getExtinguisherCollections();
}

function toPublicExtinguisher(doc: ExtinguisherDocument): PublicExtinguisher {
  return {
    id: doc._id.toHexString(),
    _id: doc._id.toHexString(),
    serialNumber: doc.serialNumber,
    location: doc.location,
    type: doc.type,
    size: doc.size,
    installationDate: doc.installationDate,
    expiryDate: doc.expiryDate,
    status: doc.status,
    createdBy: doc.createdBy.toHexString(),
    updatedBy: doc.updatedBy?.toHexString() ?? null,
    isDeleted: doc.isDeleted,
    deletedAt: doc.deletedAt ?? null,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  };
}

function deriveStatus(expiryDate: Date, currentStatus: ExtinguisherStatus) {
  if (currentStatus === "maintenance" || currentStatus === "decommissioned") {
    return currentStatus;
  }

  return expiryDate < new Date() ? "expired" : "active";
}

export async function findExtinguisherById(id: ObjectId) {
  return collections().extinguishers.findOne({ _id: id, isDeleted: false });
}

export async function findExtinguisherBySerialNumber(serialNumber: string) {
  return collections().extinguishers.findOne({ serialNumber, isDeleted: false });
}

export async function listExtinguishers() {
  const extinguishers = await collections()
    .extinguishers.find({ isDeleted: false })
    .sort({ createdAt: -1 })
    .toArray();

  return extinguishers.map((item) =>
    toPublicExtinguisher({
      ...item,
      status: deriveStatus(item.expiryDate, item.status) as ExtinguisherStatus
    })
  );
}

export async function findExtinguishersByStatus(status: ExtinguisherStatus) {
  const extinguishers = await collections()
    .extinguishers.find({ isDeleted: false })
    .toArray();

  return extinguishers
    .map((item) => ({
      ...item,
      status: deriveStatus(item.expiryDate, item.status) as ExtinguisherStatus
    }))
    .filter((item) => item.status === status)
    .map((item) =>
      toPublicExtinguisher({
        ...item,
        status: item.status as ExtinguisherStatus
      })
    );
}

export async function findExtinguishersByLocation(location: string) {
  const extinguishers = await collections()
    .extinguishers.find({ location: { $regex: new RegExp(location, "i") }, isDeleted: false })
    .sort({ createdAt: -1 })
    .toArray();

  return extinguishers.map((item) =>
    toPublicExtinguisher({
      ...item,
      status: deriveStatus(item.expiryDate, item.status) as ExtinguisherStatus
    })
  );
}

export async function createExtinguisher(
  extinguisher: Omit<ExtinguisherDocument, "_id">
) {
  const result = await collections().extinguishers.insertOne({
    ...extinguisher,
    _id: new ObjectId()
  });

  return result.insertedId ? findExtinguisherById(result.insertedId) : null;
}

export async function updateExtinguisher(id: ObjectId, payload: Partial<ExtinguisherDocument>) {
  await collections().extinguishers.updateOne(
    { _id: id, isDeleted: false },
    {
      $set: {
        ...payload,
        updatedAt: new Date()
      }
    }
  );

  return findExtinguisherById(id);
}

export async function deleteExtinguisher(id: ObjectId) {
  const existing = await findExtinguisherById(id);

  if (!existing) {
    return null;
  }

  await collections().extinguishers.updateOne(
    { _id: id },
    {
      $set: {
        isDeleted: true,
        deletedAt: new Date(),
        updatedAt: new Date()
      }
    }
  );

  return existing;
}
