import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../../../shared/lib/httpError";
import { notificationService } from "./notification.service";
import {
  createNotificationSchema,
  notificationIdParamSchema,
  notificationTypeParamSchema,
  notificationUserParamSchema,
  updateNotificationSchema
} from "./notification.validation";

function requireUser(req: Request) {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
  }

  return req.user;
}

function parseNotificationId(id: string) {
  const result = notificationIdParamSchema.safeParse({ id });
  if (!result.success) {
    throw new AppError(400, "Invalid notification id");
  }

  return result.data.id;
}

export async function getNotificationModuleStatus(_req: Request, res: Response) {
  res.status(200).json({
    success: true,
    data: {
      module: "notifications",
      status: "ready",
      endpoints: [
        "POST /api/notifications/send",
        "GET /api/notifications",
        "GET /api/notifications/:id",
        "PATCH /api/notifications/:id/read",
        "PATCH /api/notifications/:id",
        "DELETE /api/notifications/:id",
        "GET /api/notifications/type/:type",
        "GET /api/notifications/user/:userId"
      ]
    }
  });
}

export async function send(req: Request, res: Response, next: NextFunction) {
  const result = createNotificationSchema.safeParse(req.body);
  if (!result.success) {
    next(new AppError(400, "Invalid request payload", result.error.flatten()));
    return;
  }

  try {
    const user = requireUser(req);
    const data = await notificationService.send(result.data, user.role);
    res.status(201).json({
      success: true,
      message: "Notification sent successfully",
      data
    });
  } catch (error) {
    next(error);
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const user = requireUser(req);
    const data = await notificationService.list(user.id, user.role);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const user = requireUser(req);
    const data = await notificationService.getById(parseNotificationId(req.params.id), user.id, user.role);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function markAsRead(req: Request, res: Response, next: NextFunction) {
  try {
    const user = requireUser(req);
    const data = await notificationService.markAsRead(parseNotificationId(req.params.id), user.id, user.role);
    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data
    });
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  const result = updateNotificationSchema.safeParse(req.body);

  if (!result.success) {
    next(new AppError(400, "Invalid request payload", result.error.flatten()));
    return;
  }

  try {
    requireUser(req);
    const data = await notificationService.update(parseNotificationId(req.params.id), result.data, req.user!.role);
    res.status(200).json({
      success: true,
      message: "Notification updated successfully",
      data
    });
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const user = requireUser(req);
    const data = await notificationService.remove(parseNotificationId(req.params.id), user.role);
    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
      data
    });
  } catch (error) {
    next(error);
  }
}

export async function listByType(req: Request, res: Response, next: NextFunction) {
  try {
    const result = notificationTypeParamSchema.safeParse({ type: req.params.type });
    if (!result.success) {
      next(new AppError(400, "Invalid notification type"));
      return;
    }

    const user = requireUser(req);
    const data = await notificationService.listByType(result.data.type, user.role);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function listByUser(req: Request, res: Response, next: NextFunction) {
  try {
    const result = notificationUserParamSchema.safeParse({ userId: req.params.userId });
    if (!result.success) {
      next(new AppError(400, "Invalid user id"));
      return;
    }

    const user = requireUser(req);
    const data = await notificationService.listByUser(result.data.userId, user.role);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
