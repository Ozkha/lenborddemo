"use server";

import { db as database } from "@/db";
import { boards } from "@/db/schema";
import { sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type changeBoardNameProps = {
  name: string;
  boardId: number;
};
export async function changeBoardName({ name, boardId }: changeBoardNameProps) {
  const db = await database;
  await db
    .update(boards)
    .set({
      name: name,
    })
    .where(sql`${boards.id}=${boardId}`);

  revalidatePath("app/board");
}
