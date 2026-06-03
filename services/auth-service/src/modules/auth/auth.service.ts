import bcrypt from "bcrypt";
import { AppError } from "../../../../../shared/lib/httpError";
import { env } from "../../config/env";
import { toObjectId } from "../../config/database";
import {
  createUser,
  findPasswordResetTokenByHash,
  findRefreshTokenByHash,
  findUserByEmail,
  findUserById,
  markPasswordResetTokenUsed,
  revokeAllRefreshTokensForUser,
  revokeRefreshToken,
  storePasswordResetToken,
  storeRefreshToken,
  updateUserLastLoginAt,
  updateUserPassword
} from "./auth.repository";
import {
  AuthenticatedUser,
  TokenPair,
  UserRole,
  UserStatus
} from "./auth.types";
import {
  createAccessToken,
  createRefreshToken as buildRefreshToken,
  createResetToken,
  hashToken,
  verifyAccessToken,
  verifyRefreshToken,
  verifyResetToken
} from "./auth.tokens";

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RefreshInput {
  refreshToken: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  resetToken: string;
  password: string;
}

function toPublicUser(user: {
  _id: { toHexString(): string };
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}): AuthenticatedUser {
  return {
    id: user._id.toHexString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    status: user.status
  };
}

function ensureActiveAccount(status: UserStatus) {
  if (status !== "active") {
    throw new AppError(403, "Account is not active");
  }
}

async function issueTokens(user: AuthenticatedUser): Promise<TokenPair> {
  const accessToken = createAccessToken(user);
  const refreshTokenData = buildRefreshToken(user);

  await storeRefreshToken({
    userId: toObjectId(user.id),
    tokenHash: refreshTokenData.tokenHash,
    jti: refreshTokenData.jti,
    revokedAt: null,
    expiresAt: refreshTokenData.expiresAt,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  return {
    accessToken,
    refreshToken: refreshTokenData.token
  };
}

export const authService = {
  async register(input: RegisterInput) {
    const email = input.email.toLowerCase().trim();
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      throw new AppError(409, "Email already exists");
    }

    const passwordHash = await bcrypt.hash(input.password, 12);
    const now = new Date();
    const user = await createUser({
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      email,
      passwordHash,
      role: "user",
      status: "active",
      createdAt: now,
      updatedAt: now,
      lastLoginAt: null
    });

    if (!user) {
      throw new AppError(500, "Failed to create user");
    }

    const publicUser = toPublicUser(user);
    const tokens = await issueTokens(publicUser);

    return {
      user: publicUser,
      ...tokens
    };
  },

  async login(input: LoginInput) {
    const email = input.email.toLowerCase().trim();
    const user = await findUserByEmail(email);

    if (!user) {
      throw new AppError(401, "Invalid email or password");
    }

    ensureActiveAccount(user.status);

    const isValidPassword = await bcrypt.compare(input.password, user.passwordHash);

    if (!isValidPassword) {
      throw new AppError(401, "Invalid email or password");
    }

    await updateUserLastLoginAt(user._id);

    const publicUser = toPublicUser(user);
    const tokens = await issueTokens(publicUser);

    return {
      user: publicUser,
      ...tokens
    };
  },

  async refreshToken(input: RefreshInput) {
    const payload = verifyRefreshToken(input.refreshToken);

    if (payload.tokenType !== "refresh") {
      throw new AppError(401, "Invalid refresh token");
    }

    const tokenHash = hashToken(input.refreshToken);
    const tokenRecord = await findRefreshTokenByHash(tokenHash);

    if (
      !tokenRecord ||
      tokenRecord.revokedAt ||
      tokenRecord.expiresAt.getTime() <= Date.now() ||
      tokenRecord.jti !== payload.jti
    ) {
      throw new AppError(401, "Invalid refresh token");
    }

    const user = await findUserById(toObjectId(payload.userId));

    if (!user) {
      throw new AppError(404, "User not found");
    }

    ensureActiveAccount(user.status);

    await revokeRefreshToken(tokenHash);

    const publicUser = toPublicUser(user);
    const tokens = await issueTokens(publicUser);

    return {
      user: publicUser,
      ...tokens
    };
  },

  async logout(input: RefreshInput) {
    const tokenHash = hashToken(input.refreshToken);
    const tokenRecord = await findRefreshTokenByHash(tokenHash);

    if (!tokenRecord) {
      throw new AppError(401, "Invalid refresh token");
    }

    await revokeRefreshToken(tokenHash);

    return {
      message: "Logged out successfully"
    };
  },

  async validateToken(accessToken: string) {
    const payload = verifyAccessToken(accessToken);

    if (payload.tokenType !== "access") {
      throw new AppError(401, "Invalid access token");
    }

    const user = await findUserById(toObjectId(payload.userId));

    if (!user) {
      throw new AppError(401, "Invalid access token");
    }

    ensureActiveAccount(user.status);

    const publicUser = toPublicUser(user);

    return {
      valid: true,
      user: publicUser
    };
  },

  async forgotPassword(input: ForgotPasswordInput) {
    const email = input.email.toLowerCase().trim();
    const user = await findUserByEmail(email);

    if (!user) {
      return {
        message: "If the account exists, a password reset token has been generated"
      };
    }

    const publicUser = toPublicUser(user);
    const resetTokenData = createResetToken(publicUser);
    const now = new Date();

    await storePasswordResetToken({
      userId: user._id,
      tokenHash: resetTokenData.tokenHash,
      revokedAt: null,
      usedAt: null,
      expiresAt: resetTokenData.expiresAt,
      createdAt: now,
      updatedAt: now
    });

    return {
      message: "Password reset token generated",
      resetToken:
        env.nodeEnv === "production" ? undefined : resetTokenData.token
    };
  },

  async resetPassword(input: ResetPasswordInput) {
    const payload = verifyResetToken(input.resetToken);

    if (payload.tokenType !== "reset") {
      throw new AppError(401, "Invalid reset token");
    }

    const tokenHash = hashToken(input.resetToken);
    const tokenRecord = await findPasswordResetTokenByHash(tokenHash);

    if (
      !tokenRecord ||
      tokenRecord.revokedAt ||
      tokenRecord.usedAt ||
      tokenRecord.expiresAt.getTime() <= Date.now()
    ) {
      throw new AppError(401, "Invalid reset token");
    }

    const user = await findUserById(toObjectId(payload.userId));

    if (!user) {
      throw new AppError(404, "User not found");
    }

    const passwordHash = await bcrypt.hash(input.password, 12);
    await updateUserPassword(user._id, passwordHash);
    await markPasswordResetTokenUsed(tokenHash);
    await revokeAllRefreshTokensForUser(user._id);

    return {
      message: "Password reset successfully"
    };
  }
};
