import { ObjectId } from "mongodb";
import { getNotificationCollections } from "../../config/database";
import { NotificationDocument, NotificationType, PublicNotification } from "./notification.types";

function collections() {
  return getNotificationCollections();
}

function toPublicNotification(doc: NotificationDocument): PublicNotification {
  return {
    id: doc._id.toHexString(),
    userId: doc.userId.toHexString(),
    title: doc.title,
    message: doc.message,
    type: doc.type,
    isRead: doc.isRead,
    readAt: doc.readAt ?? null,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  };
}

export async function createNotification(doc: Omit<NotificationDocument, "_id">) {
  const result = await collections().notifications.insertOne({
    ...doc,
    _id: new ObjectId()
  });

  return result.insertedId ? findNotificationById(result.insertedId) : null;
}

export async function findNotificationById(id: ObjectId) {
  const document = await collections().notifications.findOne({ _id: id });
  return document ? toPublicNotification(document) : null;
}

export async function listNotifications(match: Record<string, unknown> = {}) {
  const documents = await collections()
    .notifications.find(match)
    .sort({ createdAt: -1 })
    .toArray();

  return documents.map(toPublicNotification);
}

export async function listNotificationsByUser(userId: ObjectId) {
  return listNotifications({ userId });
}

export async function listNotificationsByType(type: NotificationType) {
  return listNotifications({ type });
}

export async function updateNotification(id: ObjectId, payload: Partial<NotificationDocument>) {
  await collections().notifications.updateOne(
    { _id: id },
    {
      $set: {
        ...payload,
        updatedAt: new Date()
      }
    }
  );

  return findNotificationById(id);
}

export async function markNotificationAsRead(id: ObjectId) {
  const document = await collections().notifications.findOne({ _id: id });
  if (!document) {
    return null;
  }

  await collections().notifications.updateOne(
    { _id: id },
    {
      $set: {
        isRead: true,
        readAt: new Date(),
        updatedAt: new Date()
      }
    }
  );

  return findNotificationById(id);
}

export async function deleteNotification(id: ObjectId) {
  const document = await collections().notifications.findOne({ _id: id });
  if (!document) {
    return null;
  }

  await collections().notifications.deleteOne({ _id: id });
  return toPublicNotification(document);
}
