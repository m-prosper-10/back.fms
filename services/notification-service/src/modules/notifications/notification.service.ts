import { AppError } from "../../../../../shared/lib/httpError";
import { toObjectId } from "../../config/database";
import {
  createNotification,
  deleteNotification,
  findNotificationById,
  listNotifications,
  listNotificationsByType,
  listNotificationsByUser,
  markNotificationAsRead,
  updateNotification
} from "./notification.repository";
import { CreateNotificationInput, NotificationType, UpdateNotificationInput, UserRole } from "./notification.types";

function canManage(role: UserRole) {
  return role === "admin";
}

function canView(role: UserRole) {
  return role === "admin" || role === "inspector" || role === "user";
}

function ensureManagePermission(role: UserRole) {
  if (!canManage(role)) {
    throw new AppError(403, "Forbidden");
  }
}

function ensureViewPermission(role: UserRole) {
  if (!canView(role)) {
    throw new AppError(403, "Forbidden");
  }
}

export const notificationService = {
  async send(input: CreateNotificationInput, actorRole: UserRole) {
    ensureManagePermission(actorRole);

    const now = new Date();
    const created = await createNotification({
      userId: toObjectId(input.userId),
      title: input.title,
      message: input.message,
      type: input.type,
      isRead: false,
      readAt: null,
      createdAt: now,
      updatedAt: now
    });

    if (!created) {
      throw new AppError(500, "Failed to create notification");
    }

    return created;
  },

  async list(userId: string | undefined, role: UserRole) {
    ensureViewPermission(role);

    if (role === "admin") {
      return listNotifications();
    }

    if (!userId) {
      throw new AppError(401, "Unauthorized");
    }

    return listNotificationsByUser(toObjectId(userId));
  },

  async getById(id: string, currentUserId: string | undefined, role: UserRole) {
    ensureViewPermission(role);
    const notification = await findNotificationById(toObjectId(id));

    if (!notification) {
      throw new AppError(404, "Notification not found");
    }

    if (role !== "admin" && notification.userId !== currentUserId) {
      throw new AppError(403, "Forbidden");
    }

    return notification;
  },

  async markAsRead(id: string, currentUserId: string | undefined, role: UserRole) {
    ensureViewPermission(role);
    const notification = await findNotificationById(toObjectId(id));

    if (!notification) {
      throw new AppError(404, "Notification not found");
    }

    if (role !== "admin" && notification.userId !== currentUserId) {
      throw new AppError(403, "Forbidden");
    }

    const updated = await markNotificationAsRead(toObjectId(id));
    if (!updated) {
      throw new AppError(404, "Notification not found");
    }

    return updated;
  },

  async update(id: string, input: UpdateNotificationInput, role: UserRole) {
    ensureManagePermission(role);
    const updated = await updateNotification(toObjectId(id), {
      ...input
    });

    if (!updated) {
      throw new AppError(404, "Notification not found");
    }

    return updated;
  },

  async remove(id: string, role: UserRole) {
    ensureManagePermission(role);
    const deleted = await deleteNotification(toObjectId(id));

    if (!deleted) {
      throw new AppError(404, "Notification not found");
    }

    return deleted;
  },

  async listByType(type: NotificationType, role: UserRole) {
    ensureViewPermission(role);
    return listNotificationsByType(type);
  }
};
