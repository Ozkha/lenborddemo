"use server";

import { db as database } from "@/db";
import { newUserBoardResp, userBoardResponsabiliy } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function changeUserBoardResps(userId: number, boardsId: number[]) {
  const db = await database;

  const usersRespsDeleted = await db
    .delete(userBoardResponsabiliy)
    .where(sql`${userBoardResponsabiliy.userId}=${userId}`);

  const newVals: newUserBoardResp[] = boardsId.map((boardId) => {
    return { userId: userId, boardId: boardId };
  });
  const newRespsAdded = await db.insert(userBoardResponsabiliy).values(newVals);
}
