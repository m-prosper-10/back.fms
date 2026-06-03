import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";

dotenv.config();

type UserRole = "admin" | "inspector" | "user";
type UserStatus = "active" | "inactive" | "suspended";

type SeedUser = {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  password: string;
};

const MONGODB_URL = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/fms_backend";
const DEFAULT_PASSWORD = process.env.SEED_DEFAULT_PASSWORD || "Password123";

const users: SeedUser[] = [
  {
    firstName: "System",
    lastName: "Admin",
    email: process.env.SEED_ADMIN_EMAIL || "test_admin1@gmail.com",
    role: "admin",
    status: "active",
    password: process.env.SEED_ADMIN_PASSWORD || DEFAULT_PASSWORD
  },
  {
    firstName: "Field",
    lastName: "Inspector",
    email: process.env.SEED_INSPECTOR_EMAIL || "test_inspector1@gmail.com",
    role: "inspector",
    status: "active",
    password: process.env.SEED_INSPECTOR_PASSWORD || DEFAULT_PASSWORD
  },
  {
    firstName: "Standard",
    lastName: "User",
    email: process.env.SEED_USER_EMAIL || "test_user1@gmail.com",
    role: "user",
    status: "active",
    password: process.env.SEED_USER_PASSWORD || DEFAULT_PASSWORD
  }
];

async function main() {
  const client = new MongoClient(MONGODB_URL);
  await client.connect();

  const database = client.db();
  const collection = database.collection("users");

  for (const user of users) {
    const email = user.email.toLowerCase().trim();
    const existing = await collection.findOne({ email });

    if (existing) {
      console.log(`Skipped ${email} (already exists)`);
      continue;
    }

    const passwordHash = await bcrypt.hash(user.password, 12);
    const now = new Date();

    await collection.insertOne({
      _id: new ObjectId(),
      firstName: user.firstName,
      lastName: user.lastName,
      email,
      passwordHash,
      role: user.role,
      status: user.status,
      createdAt: now,
      updatedAt: now,
      lastLoginAt: null
    });

    console.log(`Seeded ${email} (${user.role})`);
  }

  await client.close();
}

main().catch((error: Error) => {
  console.error("Failed to seed users", error);
  process.exit(1);
});
