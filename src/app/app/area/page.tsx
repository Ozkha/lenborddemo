import { redirect } from "next/navigation";
import AreaPage from "./clientpage";
import { auth } from "@/lib/auth";
import { db as database } from "@/db";
import {
  areas,
  boards,
  fiveWhys,
  kpiMetric_tracking,
  kpis,
  wheres,
  whos,
  whys,
} from "@/db/schema";
import { asc, count, desc, sql } from "drizzle-orm";
export default async function AreaPageSuspended({ searchParams }: any) {
  const session = await auth();

  if (session) {
    if (!session.user) {
      redirect("/login");
    }
  } else {
    redirect("/login");
  }
  const user = session.user;

  const db = await database;

  const areaId = Number(searchParams.area);

  const currentDate = new Date();
  const thisYear = currentDate.getFullYear();
  const thisMonth = currentDate.getMonth() + 1;
  const thisMonthMaxDays = new Date(thisYear, thisMonth, 0).getDate();

  // TODO: Es necesario una fecha min y una max.
  // O sino, usar estados y server function en el clientPage. para recaudar dicha info cambiante.

  let dateSelected: Date = currentDate;
  const yearSelected = Number(searchParams.year);
  const monthSelected = Number(searchParams.month);
  if (yearSelected && monthSelected) {
    dateSelected = new Date(yearSelected, monthSelected, 0);
  }
  const maxDaysSelected = new Date(
    dateSelected.getFullYear(),
    dateSelected.getMonth() + 1,
    0
  ).getDate();

  const mthSlctd = dateSelected.getMonth() + 1;
  const yrSlctd = dateSelected.getFullYear();

  const areaDateSelectedResp = await db
    .select({
      data: {
        day: sql<number>`day(${kpiMetric_tracking.date})`,
        status: kpiMetric_tracking.status,
        fieldValues: kpiMetric_tracking.fieldsValues,
      },
    })
    .from(areas)
    .innerJoin(kpis, sql`${areas.kpiId}=${kpis.id}`)
    .leftJoin(
      kpiMetric_tracking,
      // TODO: Aqui - colocar el month y el year del date selected
      sql`${kpiMetric_tracking.areaId}=${areas.id} and ${kpiMetric_tracking.kpiId}=${areas.kpiId} and month(${kpiMetric_tracking.date}) = ${mthSlctd} and year(${kpiMetric_tracking.date}) = ${yrSlctd}`
    )
    .orderBy(asc(kpiMetric_tracking.date))
    .where(sql`${areas.id}=${areaId}`);

  const areaDateSelected: {
    id: number;
    name: string;
    kpi: {
      id: number;
      name: string;
      fields: string[];
    };
    data: {
      status: "success" | "fail" | "mid" | "disabled" | "empty" | null;
      fieldValues: number[];
      day: number;
    }[];
  }[] = Object.values(
    areaDateSelectedResp.reduce((acc, current) => {
      // @ts-ignore
      if (!acc[current.id]) {
        // @ts-ignore
        acc[current.id] = {
          ...current,
          data: current.data ? [current.data] : [],
        };
      } else {
        if (current.data) {
          //@ts-ignore
          acc[current.id].data.push(current.data);
        }
      }
      return acc;
    }, {})
  );

  const areasDataThisMonthYear = await db
    .select({
      data: {
        day: sql<number>`day(${kpiMetric_tracking.date})`,
        status: kpiMetric_tracking.status,
        fieldValues: kpiMetric_tracking.fieldsValues,
      },
    })
    .from(areas)
    .innerJoin(kpis, sql`${areas.kpiId}=${kpis.id}`)
    .leftJoin(
      kpiMetric_tracking,
      sql`${kpiMetric_tracking.areaId}=${areas.id} and ${kpiMetric_tracking.kpiId}=${areas.kpiId} and month(${kpiMetric_tracking.date}) = ${thisMonth} and year(${kpiMetric_tracking.date}) = ${thisYear}`
    )
    .orderBy(asc(kpiMetric_tracking.date))
    .where(sql`${areas.id}=${areaId}`);

  const areaThisMonthYearData: {
    id: number;
    name: string;
    kpi: {
      id: number;
      name: string;
      fields: string[];
    };
    data: {
      status: "success" | "fail" | "mid" | "disabled" | "empty" | null;
      fieldValues: number[];
      day: number;
    }[];
  }[] = Object.values(
    areasDataThisMonthYear.reduce((acc, current) => {
      // @ts-ignore
      if (!acc[current.id]) {
        // @ts-ignore
        acc[current.id] = {
          ...current,
          data: current.data ? [current.data] : [],
        };
      } else {
        if (current.data) {
          //@ts-ignore
          acc[current.id].data.push(current.data);
        }
      }
      return acc;
    }, {})
  );
  const [areaInfo] = await db
    .select({
      id: areas.id,
      name: areas.name,
      board: {
        name: boards.name,
      },
      kpi: {
        name: kpis.name,
      },
    })
    .from(areas)
    .where(sql`${areas.id}=${areaId}`)
    .leftJoin(boards, sql`${areas.boardId}=${boards.id}`)
    .leftJoin(kpis, sql`${areas.kpiId}=${kpis.id}`)
    .limit(1);

  type boardInfoT = {
    id: number;
    name: number;
    board: {
      name: string;
    };
    kpi: {
      name: string;
    };
  };

  const causes = await db
    .select({
      id: fiveWhys.whyId,
      name: whys.label,
      frecuency: sql<number>`count(*)`.as("frecuency"),
    })
    .from(fiveWhys)
    .innerJoin(whys, sql`${whys.id} = ${fiveWhys.whyId}`)
    .where(
      sql`${fiveWhys.companyId}=${user.companyId} and year(${fiveWhys.date}) = ${yrSlctd} and month(${fiveWhys.date}) = ${mthSlctd} and ${fiveWhys.areaId}=${areaId}`
    )
    .groupBy(fiveWhys.whyId)
    .orderBy(desc(sql`frecuency`));

  const [maxFiveWhyDumps] = await db
    .select({ val: count() })
    .from(fiveWhys)
    .where(sql`${fiveWhys.areaId}=${areaId}`);

  const [firstfiveDump] = await db
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
    .leftJoin(wheres, sql`${wheres.id}=${fiveWhys.whereId}`)
    .leftJoin(whos, sql`${whos.id}=${fiveWhys.whoId}`)
    .leftJoin(whys, sql`${whys.id}=${fiveWhys.whyId}`);

  // TODO: Muestra el nombre del area Incorrecto.

  return (
    <>
      <AreaPage
        areaInfo={areaInfo as unknown as boardInfoT}
        maxfivedumps={maxFiveWhyDumps.val}
        fivewhysFirstDump={firstfiveDump || undefined}
        areaCurrentDateData={{
          ...areaThisMonthYearData[0],
          maxDays: thisMonthMaxDays,
          date: currentDate,
        }}
        areaSelectedDateData={{
          ...areaDateSelected[0],
          maxDays: maxDaysSelected,
          date: dateSelected,
        }}
        user={user}
        causes={causes}
      ></AreaPage>
    </>
  );
}
