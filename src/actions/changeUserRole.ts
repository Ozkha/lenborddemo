"use server";

import { db as database } from "@/db";
import { users } from "@/db/schema";
import { sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type changeUserRoleProps = {
  userId: number;
  newRole: "worker" | "board_moderator";
};
export async function changeUserRole({ userId, newRole }: changeUserRoleProps) {
  const db = await database;

  if (newRole !== "board_moderator" || newRole !== "board_moderator") {
    throw new Error("The role does not exist.");
  }

  const updatedUserRole = await db
    .update(users)
    .set({ role: newRole })
    .where(sql`${users.id}=${userId}`);

  revalidatePath("/app/users");
}
