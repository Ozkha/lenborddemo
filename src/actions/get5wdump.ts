"use server";
import { db as database } from "@/db";
import { fiveWhys, wheres, whos, whys } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function get5wdump(index: number, areaId: number) {
  const db = await database;

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
    .where(sql`${fiveWhys.areaId}=${areaId}`)
    .limit(1)
    .offset(index)
    .leftJoin(wheres, sql`${wheres.id}=${fiveWhys.whereId}`)
    .leftJoin(whos, sql`${whos.id}=${fiveWhys.whoId}`)
    .leftJoin(whys, sql`${whys.id}=${fiveWhys.whyId}`);

  if (fiveDump.length < 1) return undefined;

  return fiveDump;
}
