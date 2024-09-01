"use server";

import { db as database } from "@/db";
import { whos } from "@/db/schema";

type addWhoProps = {
  label: string;
  companyId: number;
};

export async function addWho({ label, companyId }: addWhoProps) {
  const db = await database;

  const addedWhoResp = await db
    .insert(whos)
    .values({ label: label, companyId: companyId });

  return addedWhoResp[0].insertId;
}
