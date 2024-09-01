"use server";

import { db as database } from "@/db";
import { wheres } from "@/db/schema";

type addWhereProps = {
  label: string;
  companyId: number;
};

export async function addWhere({ label, companyId }: addWhereProps) {
  const db = await database;

  const addedWhereResp = await db
    .insert(wheres)
    .values({ label: label, companyId: companyId });

  return addedWhereResp[0].insertId;
}
