"use server";

import { db as database } from "@/db";
import { newUserBoardResp, userBoardResponsabiliy } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function changeUserBoardResps(userId: number, boardsId: number[]) {
  const db = await database;

  await db
    .delete(userBoardResponsabiliy)
    .where(sql`${userBoardResponsabiliy.userId}=${userId}`);

  const newVals: newUserBoardResp[] = boardsId.map((boardId) => {
    return { userId: userId, boardId: boardId };
  });
  await db.insert(userBoardResponsabiliy).values(newVals);
}
