"use server";

import { db as database } from "@/db";
import { tasks } from "@/db/schema";
import { sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deleteTask(id: number) {
  const db = await database;

  await db.delete(tasks).where(sql`${tasks.id}=${id}`);

  revalidatePath("/app/tasks");
}
