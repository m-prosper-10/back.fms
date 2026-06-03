import crypto from "crypto";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AppError } from "../../../../../shared/lib/httpError";
import { env } from "../../config/env";
import { AuthenticatedUser, UserRole } from "./auth.types";

export interface AccessTokenPayload extends JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  tokenType: "access";
}

export interface RefreshTokenPayload extends JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  tokenType: "refresh";
  jti: string;
}

export interface ResetTokenPayload extends JwtPayload {
  userId: string;
  email: string;
  tokenType: "reset";
  jti: string;
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function createAccessToken(user: AuthenticatedUser) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
      tokenType: "access"
    },
    env.raw.JWT_ACCESS_SECRET,
    {
      expiresIn: env.raw.ACCESS_TOKEN_EXPIRES_IN
    }
  );
}

export function createRefreshToken(user: AuthenticatedUser) {
  const jti = crypto.randomUUID();
  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
      tokenType: "refresh",
      jti
    },
    env.raw.JWT_REFRESH_SECRET,
    {
      expiresIn: env.raw.REFRESH_TOKEN_EXPIRES_IN
    }
  );
  const decoded = jwt.decode(token) as RefreshTokenPayload | null;

  return {
    token,
    jti,
    tokenHash: hashToken(token),
    expiresAt: decoded?.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  };
}

export function createResetToken(user: AuthenticatedUser) {
  const jti = crypto.randomUUID();
  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      tokenType: "reset",
      jti
    },
    env.raw.PASSWORD_RESET_TOKEN_SECRET,
    {
      expiresIn: env.raw.PASSWORD_RESET_TOKEN_EXPIRES_IN
    }
  );
  const decoded = jwt.decode(token) as ResetTokenPayload | null;

  return {
    token,
    jti,
    tokenHash: hashToken(token),
    expiresAt: decoded?.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 60 * 60 * 1000)
  };
}

export function verifyAccessToken(token: string) {
  try {
    return jwt.verify(token, env.raw.JWT_ACCESS_SECRET) as AccessTokenPayload;
  } catch {
    throw new AppError(401, "Invalid or expired access token");
  }
}

export function verifyRefreshToken(token: string) {
  try {
    return jwt.verify(token, env.raw.JWT_REFRESH_SECRET) as RefreshTokenPayload;
  } catch {
    throw new AppError(401, "Invalid or expired refresh token");
  }
}

export function verifyResetToken(token: string) {
  try {
    return jwt.verify(token, env.raw.PASSWORD_RESET_TOKEN_SECRET) as ResetTokenPayload;
  } catch {
    throw new AppError(401, "Invalid or expired reset token");
  }
}
