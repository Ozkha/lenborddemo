"use server";

import { db as database } from "@/db";
import { whys } from "@/db/schema";

type addWhysProps = {
  label: string;
  companyId: number;
};

export async function addWhy({ label, companyId }: addWhysProps) {
  const db = await database;

  const addedWhysResp = await db
    .insert(whys)
    .values({ label: label, companyId: companyId });

  return addedWhysResp[0].insertId;
}
