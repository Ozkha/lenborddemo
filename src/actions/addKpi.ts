"use server";

import { db as database } from "@/db";
import { kpiGoals, kpis, newKpi, newKpiGoal } from "@/db/schema";
import { revalidatePath } from "next/cache";

type addKpiProps = {
  name: string;
  metric: string;
  companyId: number;
  goal: {
    label: "success" | "fail" | "mid";
    operator: "<" | ">" | ">=" | "<=";
    amount: number;
  }[];
};

// TODO: Validacion
export default async function addKpi({
  name,
  metric,
  companyId,
  goal,
}: addKpiProps) {
  const fields = getMetricFields(metric);

  const newKpi: newKpi = {
    name: name,
    companyId: companyId,
    metric: metric,
    fields: fields,
  };

  const db = await database;

  const kpiAdded = await db.insert(kpis).values(newKpi);
  const kpiAddedInsertId = kpiAdded[0].insertId;

  //   Peuqenia validacion rapida
  if (goal[0].operator == ">") {
    throw new Error("First Goal operator invalid");
  }
  if (goal[0].operator == ">=") {
    throw new Error("First Goal operator invalid");
  }

  const newKpiGoa: newKpiGoal = {
    kpi_id: kpiAddedInsertId,
    goal: goal,
  };

  const kpiGoalAdded = await db.insert(kpiGoals).values(newKpiGoa);
  revalidatePath("/app/kpis");
}

function getMetricFields(metric: string): string[] {
  const regex = /[a-zA-Z_]\w*/g;
  const coincidencias = metric.match(regex);

  const variablesUnicas = [...new Set(coincidencias)];

  return variablesUnicas;
}
