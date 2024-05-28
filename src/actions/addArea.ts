"use server";

import { db as database } from "@/db";
import { areas } from "@/db/schema";
import { revalidatePath } from "next/cache";

type addAreaInBoardProps = {
  boardId: number;
  name: string;
  kpiId: number;
  companyId: number;
};
export async function addAreaInBoard({
  boardId,
  name,
  kpiId,
  companyId,
}: addAreaInBoardProps) {
  const db = await database;

  const addedAreaInBoardResp = await db.insert(areas).values({
    name: name,
    boardId: boardId,
    companyId: companyId,
    kpiId: kpiId,
  });

  revalidatePath("/app/board");
}
