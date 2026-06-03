import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { AppError } from "../../../../../shared/lib/httpError";
import { toObjectId } from "../../config/database";
import { changePasswordSchema, roleSchema, statusSchema, updateMeSchema, userIdParamSchema } from "./user.validation";
import {
  changeUserPassword,
  deleteUser,
  getUserProfile,
  listUsers,
  updateUserProfile,
  updateUserRole,
  updateUserStatus
} from "./user.repository";

function parseUserId(id: string) {
  const result = userIdParamSchema.safeParse({ id });

  if (!result.success) {
    throw new AppError(400, "Invalid user id");
  }

  return toObjectId(result.data.id);
}

function requireUser(req: Request) {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
  }

  return req.user;
}

export async function getUserModuleStatus(_req: Request, res: Response) {
  res.status(200).json({
    success: true,
    data: {
      module: "users",
      status: "ready",
      endpoints: [
        "GET /api/users/meta",
        "GET /api/users/me",
        "PATCH /api/users/me",
        "PATCH /api/users/change-password",
        "GET /api/users",
        "GET /api/users/:id",
        "PATCH /api/users/:id",
        "DELETE /api/users/:id",
        "PATCH /api/users/:id/role",
        "PATCH /api/users/:id/status"
      ]
    }
  });
}

export async function getUserModuleMeta(_req: Request, res: Response) {
  res.status(200).json({
    success: true,
    data: {
      module: "users",
      status: "ready"
    }
  });
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const user = requireUser(req);
    const profile = await getUserProfile(parseUserId(user.id));

    if (!profile) {
      next(new AppError(404, "User not found"));
      return;
    }

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
}

export async function updateMe(req: Request, res: Response, next: NextFunction) {
  const result = updateMeSchema.safeParse(req.body);

  if (!result.success) {
    next(new AppError(400, "Invalid request payload", result.error.flatten()));
    return;
  }

  try {
    const user = requireUser(req);
    const profile = await updateUserProfile(parseUserId(user.id), result.data);

    if (!profile) {
      next(new AppError(404, "User not found"));
      return;
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: profile
    });
  } catch (error) {
    next(error);
  }
}

export async function changePassword(req: Request, res: Response, next: NextFunction) {
  const result = changePasswordSchema.safeParse(req.body);

  if (!result.success) {
    next(new AppError(400, "Invalid request payload", result.error.flatten()));
    return;
  }

  try {
    const user = requireUser(req);
    const outcome = await changeUserPassword(
      parseUserId(user.id),
      result.data.currentPassword,
      result.data.newPassword
    );

    if (outcome === null) {
      next(new AppError(404, "User not found"));
      return;
    }

    if (outcome === "invalid-current-password") {
      next(new AppError(400, "Current password is invalid"));
      return;
    }

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
      data: null
    });
  } catch (error) {
    next(error);
  }
}

export async function listUsersHandler(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await listUsers();
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
}

export async function getUserByIdHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseUserId(req.params.id);
    const user = await getUserProfile(id);

    if (!user) {
      next(new AppError(404, "User not found"));
      return;
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
}

export async function updateUserByIdHandler(req: Request, res: Response, next: NextFunction) {
  const result = updateMeSchema.safeParse(req.body);

  if (!result.success) {
    next(new AppError(400, "Invalid request payload", result.error.flatten()));
    return;
  }

  try {
    const id = parseUserId(req.params.id);
    const user = await updateUserProfile(id, result.data);

    if (!user) {
      next(new AppError(404, "User not found"));
      return;
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteUserHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseUserId(req.params.id);
    const user = await deleteUser(id);

    if (!user) {
      next(new AppError(404, "User not found"));
      return;
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: user
    });
  } catch (error) {
    next(error);
  }
}

export async function updateUserRoleHandler(req: Request, res: Response, next: NextFunction) {
  const result = roleSchema.safeParse(req.body);

  if (!result.success) {
    next(new AppError(400, "Invalid request payload", result.error.flatten()));
    return;
  }

  try {
    const id = parseUserId(req.params.id);
    const user = await updateUserRole(id, result.data.role);

    if (!user) {
      next(new AppError(404, "User not found"));
      return;
    }

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: user
    });
  } catch (error) {
    next(error);
  }
}

export async function updateUserStatusHandler(req: Request, res: Response, next: NextFunction) {
  const result = statusSchema.safeParse(req.body);

  if (!result.success) {
    next(new AppError(400, "Invalid request payload", result.error.flatten()));
    return;
  }

  try {
    const id = parseUserId(req.params.id);
    const user = await updateUserStatus(id, result.data.status);

    if (!user) {
      next(new AppError(404, "User not found"));
      return;
    }

    res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: user
    });
  } catch (error) {
    next(error);
  }
}
