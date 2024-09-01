"use server";

import { db as database } from "@/db";
import { kpiGoals, newKpiGoal } from "@/db/schema";
import { revalidatePath } from "next/cache";

type addKpiProps = {
  id: number;

  newGoal: {
    label: "success" | "fail" | "mid";
    operator: ">" | "<=";
    amount: number;
  }[];
};

// TODO: Validacion
export default async function updateKpi({ id, newGoal }: addKpiProps) {
  const db = await database;

  const newKpiGoa: newKpiGoal = {
    kpi_id: id,
    goal: newGoal,
  };

  await db.insert(kpiGoals).values(newKpiGoa);
  revalidatePath("/app/kpis");
}
