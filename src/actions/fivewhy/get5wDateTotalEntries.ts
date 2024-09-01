"use server";

import { db as database } from "@/db";
import { fiveWhys } from "@/db/schema";
import { count, sql } from "drizzle-orm";

export async function get5wDateTotalEntries(areaId: number, date: Date) {
  const db = await database;

  const [maxFiveWhyDumps] = await db
    .select({ val: count() })
    .from(fiveWhys)
    .where(
      sql`${fiveWhys.areaId}=${areaId} and year(${
        fiveWhys.date
      }) = ${date.getFullYear()} and month(${fiveWhys.date}) = ${
        date.getMonth() + 1
      } and day(${fiveWhys.date}) = ${date.getDate()}`
    );

  return maxFiveWhyDumps.val;
}
