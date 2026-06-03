export type UserRole = "admin" | "inspector" | "user";
export type UserStatus = "active" | "inactive" | "suspended";

export interface UserDocument {
  _id: import("mongodb").ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date | null;
}

export interface PublicUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date | null;
}
