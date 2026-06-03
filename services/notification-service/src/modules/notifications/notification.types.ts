import { ObjectId } from "mongodb";

export type UserRole = "admin" | "inspector" | "user";
export type UserStatus = "active" | "inactive" | "suspended";
export type NotificationType = "inspection" | "maintenance" | "expiry" | "system";

export interface NotificationDocument {
  _id: ObjectId;
  userId: ObjectId;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  readAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  readAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNotificationInput {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
}

export interface UpdateNotificationInput {
  title?: string;
  message?: string;
  type?: NotificationType;
  isRead?: boolean;
}
