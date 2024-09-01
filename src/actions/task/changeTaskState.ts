"use server";

import { db as database } from "@/db";
import { tasks } from "@/db/schema";
import { sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function changeTaskState(
  taskId: number,
  state: "todo" | "inprogress" | "completed"
) {
  const db = await database;
  await db
    .update(tasks)
    .set({
      status: state,
    })
    .where(sql`${tasks.id}=${taskId}`);

  revalidatePath("/app/tasks");
}
