import { ObjectId } from "mongodb";

export type UserRole = "admin" | "inspector" | "user";
export type UserStatus = "active" | "inactive" | "suspended";
export type ExtinguisherType = "Water" | "CO2" | "Foam" | "Dry Chemical";
export type ExtinguisherSize = "1.5 lb" | "5 lb" | "9 lb" | "12 lb";
export type ExtinguisherStatus = "active" | "expired" | "maintenance" | "decommissioned";

export interface ExtinguisherDocument {
  _id: ObjectId;
  serialNumber: string;
  location: string;
  type: ExtinguisherType;
  size: ExtinguisherSize;
  installationDate: Date;
  expiryDate: Date;
  status: ExtinguisherStatus;
  createdBy: ObjectId;
  updatedBy?: ObjectId | null;
  isDeleted: boolean;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicExtinguisher {
  id: string;
  _id: string;
  serialNumber: string;
  location: string;
  type: ExtinguisherType;
  size: ExtinguisherSize;
  installationDate: Date;
  expiryDate: Date;
  status: ExtinguisherStatus;
  createdBy: string;
  updatedBy?: string | null;
  isDeleted: boolean;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
