import { auth } from "@/lib/auth";
import BoardPage from "./clientpage";
import { redirect, useSearchParams } from "next/navigation";
import { db as database } from "@/db";
import { areas, boards, kpiMetric_tracking, kpis } from "@/db/schema";
import { asc, desc, sql } from "drizzle-orm";

export default async function BooardPageSuspensed({ searchParams }: any) {
  const session = await auth();

  if (session) {
    if (!session.user) {
      redirect("/login");
    }
  } else {
    redirect("/login");
  }

  const user = session.user;

  if (!searchParams.board) {
    return <div>Es necesario especificar un tablero</div>;
  }
  const boardId = Number(searchParams.board);

  const db = await database;

  const [boardInfo] = await db
    .select({
      id: boards.id,
      name: boards.name,
    })
    .from(boards)
    .where(sql`${boards.id}=${boardId}`);

  const kpiList = await db
    .select({
      id: kpis.id,
      name: kpis.name,
      fields: kpis.fields,
    })
    .from(kpis);

  let year = searchParams.year;
  let month = searchParams.month;

  if (!year) {
    year = new Date().getFullYear();
  }
  if (!month) {
    month = new Date().getMonth() + 1;
  }

  year = Number(year);
  month = Number(month);

  const areasPerBoardListLABUENA = await db
    .select({
      id: areas.id,
      name: areas.name,
      kpi: {
        id: kpis.id,
        name: kpis.name,
        fields: kpis.fields,
      },
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
      sql`${kpiMetric_tracking.areaId}=${areas.id} and ${kpiMetric_tracking.kpiId}=${areas.kpiId} and month(${kpiMetric_tracking.date}) = ${month} and year(${kpiMetric_tracking.date}) = ${year}`
    )
    .orderBy(asc(kpiMetric_tracking.date));

  const areaList: {
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
    areasPerBoardListLABUENA.reduce((acc, current) => {
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

  // console.log("Usando el output ya ordenado:");
  // console.log(areaList);
  // console.log("Detallado [1]:");
  // console.log(areaList[1]);

  // TODO: Talvez mas despues hacer con server component o delayed component el boton para agregar mas areas

  // TODO: Que sea funciona el KPI-Tracking
  // -- Veo especial dificultad en el uso de la metrica para establecer un resultado
  // -- Si no se ah rellenado nada o no se ah establecido un valor para ese dia, entonces dar como empty. (No se si agregar una opcion para que sea reversible)

  return (
    <>
      <BoardPage
        dateInfo={{ month, year, maxDays: new Date(year, month, 0).getDate() }}
        areaList={areaList}
        kpiList={kpiList}
        boardInfo={boardInfo}
        user={user}
      ></BoardPage>
    </>
  );
}
