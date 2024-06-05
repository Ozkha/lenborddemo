"use server";

import { db as database } from "@/db";
import { fiveWhys } from "@/db/schema";

type create5wDumpProps = {
  date: Date;
  what: string;
  whereId: number;
  whoId: number;
  whyId: number;
  whyDetails?: string;
  areaId: number;
  companyId: number;
};

export async function create5wDump({
  date,
  what,
  whereId,
  whoId,
  whyId,
  whyDetails,
  areaId,
  companyId,
}: create5wDumpProps) {
  const db = await database;

  const create5wDumpResp = await db.insert(fiveWhys).values({
    date: date,
    what: what,
    whereId: whereId,
    whoId: whoId,
    whyId: whyId,
    whyDetails: whyDetails,
    areaId: areaId,
    companyId: companyId,
  });
}
