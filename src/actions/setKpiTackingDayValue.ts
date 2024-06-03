"use server";

import { db as database } from "@/db";
import { kpiGoals, kpiMetric_tracking, kpis } from "@/db/schema";
import { desc, max, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type setKpiTrackingDayValueProps = {
  date: Date;
  areaId: number;
  kpiId: number;
  values: number[];
  diaInhabil: boolean;
  companyId: number;
};
export async function setKpiTrackingDayValue({
  date,
  areaId,
  kpiId,
  values,
  diaInhabil,
  companyId,
}: setKpiTrackingDayValueProps) {
  const db = await database;

  let willInsert: boolean = false;
  const trackRow = await db
    .select()
    .from(kpiMetric_tracking)
    .where(
      sql`day(${kpiMetric_tracking.date})=${date.getDate()} and month(${
        kpiMetric_tracking.date
      }) = ${date.getMonth() + 1} and ${
        kpiMetric_tracking.areaId
      } = ${areaId} and ${kpiMetric_tracking.kpiId} = ${kpiId}`
    );

  if (trackRow.length < 1) willInsert = true;

  const [lastKpiGoal] = await db
    .select({
      id: kpiGoals.id,
      goal: kpiGoals.goal,
      metric: kpis.metric,
      fields: kpis.fields,
    })
    .from(kpiGoals)
    .orderBy(desc(kpiGoals.createdAt))
    .where(sql`${kpiGoals.kpi_id}=${kpiId}`)
    .innerJoin(kpis, sql`${kpis.id}=${kpiId}`)
    .limit(1);

  if (values.length < 1) {
    lastKpiGoal.fields.forEach(() => {
      values.push(0);
    });
  }

  // TODO: HACER UNA LISTA DE LOS LIMITES DEL getMetricValue y de el obtener las variables funcion, que es cuand ose crean los KPI

  let finalValue = getMetricValue(lastKpiGoal.metric, values) || 0;

  let status: "success" | "fail" | "mid" | "disabled" | "empty";
  if (diaInhabil) {
    status = "disabled";
  } else {
    status = classify(lastKpiGoal.goal, finalValue);
  }

  // FIXME: PARECE: CHECARLO DESPUES. Eta pasando que aparentemente en lugar de actualiza, crea uno nuevo.
  if (willInsert) {
    const insertKpiTrackignResp = await db.insert(kpiMetric_tracking).values({
      date: date,
      areaId: areaId,
      kpiId: kpiId,
      kpiGoalId: lastKpiGoal.id,
      status: status,
      value: finalValue,
      fieldsValues: values,
      companyId: companyId,
    });
  } else {
    const updateKpiTrackingResp = await db
      .update(kpiMetric_tracking)
      .set({
        status: status,
        value: finalValue,
        fieldsValues: values,
      })
      .where(sql`${kpiMetric_tracking.id}=${trackRow[0].id}`);
  }

  revalidatePath("/app/board");
}

function getMetricValue(metrica: string, valores: number[]) {
  //@ts-ignore
  const variables = metrica.match(/\b\w+\b/g).filter((v) => isNaN(v));

  if (variables.length !== valores.length) {
    throw new Error(
      "El número de variables en la métrica no coincide con el número de valores proporcionados."
    );
  }

  const contexto = {};
  variables.forEach((variable, index) => {
    //@ts-ignore
    contexto[variable] = valores[index];
  });

  const functionBody = `with (this) { return ${metrica}; }`;
  const evaluador = new Function(functionBody);

  return evaluador.call(contexto);
}

function classify(
  rules: {
    label: "success" | "fail" | "mid";
    amount: number;
    operator: "<" | ">" | "<=" | ">=";
  }[],
  value: number
) {
  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];
    switch (rule.operator) {
      case "<":
        if (value < rule.amount) {
          return rule.label;
        }
        break;
      case "<=":
        if (value <= rule.amount) {
          return rule.label;
        }
        break;
      case ">":
        if (value > rule.amount) {
          return rule.label;
        }
        break;
      case ">=":
        if (value >= rule.amount) {
          return rule.label;
        }
        break;
    }
  }
  return "disabled"; // En caso de que ninguna regla se cumpla
}
