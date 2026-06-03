import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../../../../shared/lib/httpError";
import {
  forgotPasswordSchema,
  loginSchema,
  refreshTokenSchema,
  registerSchema,
  resetPasswordSchema
} from "./auth.validation";
import { authService } from "./auth.service";

function parseAuthHeader(req: Request) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    throw new AppError(401, "Authorization header is required");
  }

  return header.slice(7);
}

export async function getAuthModuleStatus(_req: Request, res: Response) {
  res.status(200).json({
    success: true,
    data: {
      module: "auth",
      status: "ready",
      endpoints: [
        "POST /api/auth/register",
        "POST /api/auth/login",
        "POST /api/auth/logout",
        "POST /api/auth/refresh-token",
        "POST /api/auth/forgot-password",
        "POST /api/auth/reset-password",
        "GET /api/auth/validate-token"
      ]
    }
  });
}

export async function register(req: Request, res: Response, next: NextFunction) {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    next(new AppError(400, "Invalid request payload", result.error.flatten()));
    return;
  }

  try {
    const data = await authService.register(result.data);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    next(new AppError(400, "Invalid request payload", result.error.flatten()));
    return;
  }

  try {
    const data = await authService.login(result.data);
    res.status(200).json({
      success: true,
      message: "Login successful",
      data
    });
  } catch (error) {
    next(error);
  }
}

export async function refreshToken(req: Request, res: Response, next: NextFunction) {
  const result = refreshTokenSchema.safeParse(req.body);

  if (!result.success) {
    next(new AppError(400, "Invalid request payload", result.error.flatten()));
    return;
  }

  try {
    const data = await authService.refreshToken(result.data);
    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  const result = refreshTokenSchema.safeParse(req.body);

  if (!result.success) {
    next(new AppError(400, "Invalid request payload", result.error.flatten()));
    return;
  }

  try {
    const data = await authService.logout(result.data);
    res.status(200).json({
      success: true,
      message: data.message,
      data
    });
  } catch (error) {
    next(error);
  }
}

export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  const result = forgotPasswordSchema.safeParse(req.body);

  if (!result.success) {
    next(new AppError(400, "Invalid request payload", result.error.flatten()));
    return;
  }

  try {
    const data = await authService.forgotPassword(result.data);
    res.status(200).json({
      success: true,
      message: "Password reset request processed",
      data
    });
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  const result = resetPasswordSchema.safeParse(req.body);

  if (!result.success) {
    next(new AppError(400, "Invalid request payload", result.error.flatten()));
    return;
  }

  try {
    const data = await authService.resetPassword(result.data);
    res.status(200).json({
      success: true,
      message: "Password reset successfully",
      data
    });
  } catch (error) {
    next(error);
  }
}

export async function validateToken(req: Request, res: Response, next: NextFunction) {
  try {
    const accessToken = parseAuthHeader(req);
    const data = await authService.validateToken(accessToken);
    res.status(200).json({
      success: true,
      message: "Token is valid",
      data
    });
  } catch (error) {
    next(error);
  }
}
