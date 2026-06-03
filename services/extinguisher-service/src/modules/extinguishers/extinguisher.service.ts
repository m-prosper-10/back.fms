import { AppError } from "../../../../../shared/lib/httpError";
import { toObjectId } from "../../config/database";
import {
  createExtinguisher,
  deleteExtinguisher,
  findExtinguisherById,
  findExtinguisherBySerialNumber,
  findExtinguishersByLocation,
  findExtinguishersByStatus,
  listExtinguishers,
  updateExtinguisher
} from "./extinguisher.repository";
import {
  ExtinguisherDocument,
  ExtinguisherStatus,
  UserRole,
  UserStatus
} from "./extinguisher.types";

export interface CreateExtinguisherInput {
  serialNumber: string;
  location: string;
  type: ExtinguisherDocument["type"];
  size: ExtinguisherDocument["size"];
  installationDate: Date;
  expiryDate: Date;
}

export interface UpdateExtinguisherInput {
  serialNumber?: string;
  location?: string;
  type?: ExtinguisherDocument["type"];
  size?: ExtinguisherDocument["size"];
  installationDate?: Date;
  expiryDate?: Date;
  status?: ExtinguisherStatus;
}

function canWrite(role: UserRole) {
  return role === "admin" || role === "inspector";
}

function canRead(role: UserRole) {
  return role === "admin" || role === "inspector" || role === "user";
}

function canDelete(role: UserRole) {
  return role === "admin";
}

function deriveStatus(expiryDate: Date, currentStatus: ExtinguisherStatus) {
  if (currentStatus === "maintenance" || currentStatus === "decommissioned") {
    return currentStatus;
  }

  return expiryDate < new Date() ? "expired" : "active";
}

export function normalizeExtinguisherStatus(
  expiryDate: Date,
  currentStatus: ExtinguisherStatus
) {
  return deriveStatus(expiryDate, currentStatus);
}

function ensureReadable(role: UserRole) {
  if (!canRead(role)) {
    throw new AppError(403, "Forbidden");
  }
}

function ensureWritable(role: UserRole) {
  if (!canWrite(role)) {
    throw new AppError(403, "Forbidden");
  }
}

function ensureDeletable(role: UserRole) {
  if (!canDelete(role)) {
    throw new AppError(403, "Forbidden");
  }
}

export const extinguisherService = {
  async list(role: UserRole) {
    ensureReadable(role);
    return listExtinguishers();
  },

  async getById(id: string, role: UserRole) {
    ensureReadable(role);
    const extinguisher = await findExtinguisherById(toObjectId(id));

    if (!extinguisher) {
      throw new AppError(404, "Extinguisher not found");
    }

    return extinguisher;
  },

  async create(input: CreateExtinguisherInput, actorId: string, role: UserRole) {
    ensureWritable(role);

    const existing = await findExtinguisherBySerialNumber(input.serialNumber);
    if (existing) {
      throw new AppError(409, "Serial number already exists");
    }

    const now = new Date();
    const created = await createExtinguisher({
      serialNumber: input.serialNumber.trim(),
      location: input.location.trim(),
      type: input.type,
      size: input.size,
      installationDate: input.installationDate,
      expiryDate: input.expiryDate,
      status: deriveStatus(input.expiryDate, "active"),
      createdBy: toObjectId(actorId),
      updatedBy: null,
      isDeleted: false,
      deletedAt: null,
      createdAt: now,
      updatedAt: now
    });

    if (!created) {
      throw new AppError(500, "Failed to create extinguisher");
    }

    return created;
  },

  async update(id: string, input: UpdateExtinguisherInput, actorId: string, role: UserRole) {
    ensureWritable(role);

    const extinguisher = await findExtinguisherById(toObjectId(id));
    if (!extinguisher) {
      throw new AppError(404, "Extinguisher not found");
    }

    if (input.serialNumber && input.serialNumber !== extinguisher.serialNumber) {
      const duplicate = await findExtinguisherBySerialNumber(input.serialNumber);
      if (duplicate) {
        throw new AppError(409, "Serial number already exists");
      }
    }

    const nextExpiryDate = input.expiryDate ?? extinguisher.expiryDate;
    const nextStatus =
      input.status ?? deriveStatus(nextExpiryDate, extinguisher.status);

    const updated = await updateExtinguisher(toObjectId(id), {
      ...input,
      status: nextStatus,
      updatedBy: toObjectId(actorId)
    });

    if (!updated) {
      throw new AppError(404, "Extinguisher not found");
    }

    return updated;
  },

  async remove(id: string, role: UserRole) {
    ensureDeletable(role);
    const deleted = await deleteExtinguisher(toObjectId(id));

    if (!deleted) {
      throw new AppError(404, "Extinguisher not found");
    }

    return deleted;
  },

  async filterByStatus(status: ExtinguisherStatus, role: UserRole) {
    ensureReadable(role);
    return findExtinguishersByStatus(status);
  },

  async filterByLocation(location: string, role: UserRole) {
    ensureReadable(role);
    return findExtinguishersByLocation(location);
  }
};
