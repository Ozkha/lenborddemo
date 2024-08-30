"use server";
import { db as database } from "@/db";
import { boards } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function addBoard(newBoard: { name: string; companyId: number }) {
  const db = await database;

  await db.insert(boards).values(newBoard);

  revalidatePath("/app/boards");
}
