import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import { getUserCollections } from "../../config/database";
import { PublicUser, UserDocument, UserRole, UserStatus } from "./user.types";

function toPublicUser(user: UserDocument): PublicUser {
  return {
    id: user._id.toHexString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    lastLoginAt: user.lastLoginAt ?? null
  };
}

function collections() {
  return getUserCollections();
}

export async function findUserById(id: ObjectId) {
  return collections().users.findOne({ _id: id });
}

export async function findUserByEmail(email: string) {
  return collections().users.findOne({ email });
}

export async function createUser(
  payload: Omit<UserDocument, "_id" | "createdAt" | "updatedAt" | "lastLoginAt" | "passwordHash"> & {
    password: string;
  }
) {
  const existingUser = await findUserByEmail(payload.email);

  if (existingUser) {
    return null;
  }

  const passwordHash = await bcrypt.hash(payload.password, 12);
  const now = new Date();

  const result = await collections().users.insertOne({
    _id: new ObjectId(),
    firstName: payload.firstName.trim(),
    lastName: payload.lastName.trim(),
    email: payload.email.toLowerCase().trim(),
    passwordHash,
    role: payload.role,
    status: payload.status,
    createdAt: now,
    updatedAt: now,
    lastLoginAt: null
  });

  return result.insertedId ? findUserById(result.insertedId) : null;
}

export async function listUsers() {
  const users = await collections().users.find({}).sort({ createdAt: -1 }).toArray();
  return users.map(toPublicUser);
}

export async function getUserProfile(id: ObjectId) {
  const user = await findUserById(id);
  return user ? toPublicUser(user) : null;
}

export async function updateUserProfile(
  id: ObjectId,
  payload: Partial<Pick<UserDocument, "firstName" | "lastName">>
) {
  await collections().users.updateOne(
    { _id: id },
    {
      $set: {
        ...payload,
        updatedAt: new Date()
      }
    }
  );

  return getUserProfile(id);
}

export async function changeUserPassword(id: ObjectId, currentPassword: string, newPassword: string) {
  const user = await findUserById(id);

  if (!user) {
    return null;
  }

  const isValid = await bcrypt.compare(currentPassword, user.passwordHash);

  if (!isValid) {
    return "invalid-current-password" as const;
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await collections().users.updateOne(
    { _id: id },
    {
      $set: {
        passwordHash,
        updatedAt: new Date()
      }
    }
  );

  return "ok" as const;
}

export async function updateUserRole(id: ObjectId, role: UserRole) {
  await collections().users.updateOne(
    { _id: id },
    {
      $set: {
        role,
        updatedAt: new Date()
      }
    }
  );

  return getUserProfile(id);
}

export async function updateUserStatus(id: ObjectId, status: UserStatus) {
  await collections().users.updateOne(
    { _id: id },
    {
      $set: {
        status,
        updatedAt: new Date()
      }
    }
  );

  return getUserProfile(id);
}

export async function deleteUser(id: ObjectId) {
  const user = await findUserById(id);
  if (!user) {
    return null;
  }

  await collections().users.deleteOne({ _id: id });
  return toPublicUser(user);
}
