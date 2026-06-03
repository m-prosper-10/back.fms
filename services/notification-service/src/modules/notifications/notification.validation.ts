import { z } from "zod";

const notificationTypes = ["inspection", "maintenance", "expiry", "system"] as const;

export const createNotificationSchema = z.object({
  userId: z.string().min(1, "User id is required"),
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  type: z.enum(notificationTypes)
});

export const updateNotificationSchema = z.object({
  title: z.string().min(1).optional(),
  message: z.string().min(1).optional(),
  type: z.enum(notificationTypes).optional(),
  isRead: z.boolean().optional()
});

export const notificationIdParamSchema = z.object({
  id: z.string().min(1, "Notification id is required")
});

export const notificationUserParamSchema = z.object({
  userId: z.string().min(1, "User id is required")
});

export const notificationTypeParamSchema = z.object({
  type: z.enum(notificationTypes)
});
