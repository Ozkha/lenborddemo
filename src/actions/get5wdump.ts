"use server";
import { db as database } from "@/db";
import { fiveWhys, wheres, whos, whys } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function get5wdump(index: number, areaId: number, date?: Date) {
  const db = await database;

  const defaultWhereQuery = sql`${fiveWhys.areaId}=${areaId}`;

  console.log(
    "🚀 Date: " +
      date?.getFullYear() +
      " - " +
      date?.getMonth() +
      " - " +
      date?.getDate()
  );

  if (date) {
    defaultWhereQuery.append(
      sql` and year(${fiveWhys.date}) = ${date.getFullYear()} and month(${
        fiveWhys.date
      }) = ${date.getMonth() + 1} and day(${fiveWhys.date}) = ${date.getDate()}`
    );
  }

  const fiveDump = await db
    .select({
      date: fiveWhys.date,
      what: fiveWhys.what,
      where: wheres.label,
      who: whos.label,
      why: whys.label,
      whyDetails: fiveWhys.whyDetails,
    })
    .from(fiveWhys)
    .where(defaultWhereQuery)
    .limit(1)
    .offset(index)
    .leftJoin(wheres, sql`${wheres.id}=${fiveWhys.whereId}`)
    .leftJoin(whos, sql`${whos.id}=${fiveWhys.whoId}`)
    .leftJoin(whys, sql`${whys.id}=${fiveWhys.whyId}`);

  if (fiveDump.length < 1) return undefined;

  return fiveDump;
}
