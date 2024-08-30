"use server";

import { db as database } from "@/db";
import { users } from "@/db/schema";
import { sql } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function changeUserPassword(userId: number, newPassword: string) {
  const db = await database;

  const salt = bcrypt.genSaltSync(10);
  const hashedPass = bcrypt.hashSync(newPassword, salt);
  await db
    .update(users)
    .set({ password: hashedPass })
    .where(sql`${users.id}=${userId}`);
}
