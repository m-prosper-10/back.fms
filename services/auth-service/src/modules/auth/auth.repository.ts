import { ObjectId } from "mongodb";
import { getAuthCollections } from "../../config/database";
import {
  AuthUserDocument,
  PasswordResetTokenDocument,
  RefreshTokenDocument
} from "./auth.types";

const collections = () => getAuthCollections();

export async function findUserByEmail(email: string) {
  return collections().users.findOne({ email });
}

export async function findUserById(id: ObjectId) {
  return collections().users.findOne({ _id: id });
}

export async function createUser(user: Omit<AuthUserDocument, "_id">) {
  const result = await collections().users.insertOne({
    ...user,
    _id: new ObjectId()
  });

  return findUserById(result.insertedId);
}

export async function updateUserLastLoginAt(id: ObjectId) {
  await collections().users.updateOne(
    { _id: id },
    {
      $set: {
        lastLoginAt: new Date(),
        updatedAt: new Date()
      }
    }
  );
}

export async function updateUserPassword(id: ObjectId, passwordHash: string) {
  await collections().users.updateOne(
    { _id: id },
    {
      $set: {
        passwordHash,
        updatedAt: new Date()
      }
    }
  );
}

export async function createRefreshToken(token: Omit<RefreshTokenDocument, "_id">) {
  await collections().refreshTokens.insertOne({
    ...token,
    _id: new ObjectId()
  });
}

export async function findRefreshTokenByHash(tokenHash: string) {
  return collections().refreshTokens.findOne({ tokenHash });
}

export async function revokeRefreshToken(tokenHash: string) {
  await collections().refreshTokens.updateOne(
    { tokenHash },
    {
      $set: {
        revokedAt: new Date(),
        updatedAt: new Date()
      }
    }
  );
}

export async function revokeAllRefreshTokensForUser(userId: ObjectId) {
  await collections().refreshTokens.updateMany(
    { userId, revokedAt: null },
    {
      $set: {
        revokedAt: new Date(),
        updatedAt: new Date()
      }
    }
  );
}

export async function createPasswordResetToken(token: Omit<PasswordResetTokenDocument, "_id">) {
  await collections().passwordResetTokens.insertOne({
    ...token,
    _id: new ObjectId()
  });
}

export async function findPasswordResetTokenByHash(tokenHash: string) {
  return collections().passwordResetTokens.findOne({ tokenHash });
}

export async function markPasswordResetTokenUsed(tokenHash: string) {
  await collections().passwordResetTokens.updateOne(
    { tokenHash },
    {
      $set: {
        usedAt: new Date(),
        updatedAt: new Date()
      }
    }
  );
}

export async function revokePasswordResetToken(tokenHash: string) {
  await collections().passwordResetTokens.updateOne(
    { tokenHash },
    {
      $set: {
        revokedAt: new Date(),
        updatedAt: new Date()
      }
    }
  );
}
