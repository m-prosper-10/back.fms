import { ObjectId } from "mongodb";

export type UserRole = "admin" | "inspector" | "user";
export type UserStatus = "active" | "inactive" | "suspended";

export interface AuthUserDocument {
  _id: ObjectId;
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

export interface RefreshTokenDocument {
  _id: ObjectId;
  userId: ObjectId;
  tokenHash: string;
  jti: string;
  revokedAt?: Date | null;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PasswordResetTokenDocument {
  _id: ObjectId;
  userId: ObjectId;
  tokenHash: string;
  revokedAt?: Date | null;
  usedAt?: Date | null;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthenticatedUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
