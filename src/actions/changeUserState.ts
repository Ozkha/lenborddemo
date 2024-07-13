"use server";

import { db as database } from "@/db";
import { users } from "@/db/schema";
import { sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function changeUserState(
  userId: number,
  newState: "inactive" | "active"
) {
  const db = await database;

  const userStateUpdatedResp = await db
    .update(users)
    .set({ status: newState })
    .where(sql`${users.id}=${userId}`);

  revalidatePath("/app/users");
}
