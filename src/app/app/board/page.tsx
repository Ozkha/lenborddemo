import { auth } from "@/lib/auth";
import BoardPage from "./clientpage";
import { redirect, useSearchParams } from "next/navigation";
import { db as database } from "@/db";
import { areas, boards, kpis } from "@/db/schema";
import { sql } from "drizzle-orm";

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

  // TODO: Ahora sigue el board, y creo que despues el area
  // o una combinacion de entre los 2

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
    })
    .from(kpis);

  const areaPerBoardList = await db
    .select({ id: areas.id, name: areas.name, kpiId: areas.kpiId })
    .from(areas)
    .where(
      sql`${areas.companyId}=${user.companyId} and ${areas.boardId}=${boardInfo.id}`
    );

  const areaPerBoardListAlter = areaPerBoardList.map((area) => {
    return {
      ...area,
      mainCauses: [],
      data: [
        { label: "Dia 1", state: "fail" },
        { label: "Dia 2", state: "success" },
        { label: "Dia 3", state: "midpoint" },
        { label: "Dia 4", state: "disabled" },
        { label: "Dia 5", state: "success" },
        { label: "Dia 6", state: "fail" },
        { label: "Dia 7", state: "fail" },
        { label: "Dia 8", state: "empty" },
        { label: "Dia 9", state: "empty" },
        { label: "Dia 10", state: "empty" },
        { label: "Dia 11", state: "empty" },
        { label: "Dia 12", state: "empty" },
        { label: "Dia 13", state: "empty" },
        { label: "Dia 14", state: "empty" },
        { label: "Dia 15", state: "empty" },
        { label: "Dia 16", state: "empty" },
        { label: "Dia 17", state: "empty" },
        { label: "Dia 18", state: "empty" },
        { label: "Dia 19", state: "empty" },
        { label: "Dia 20", state: "empty" },
        { label: "Dia 21", state: "empty" },
        { label: "Dia 22", state: "empty" },
        { label: "Dia 23", state: "empty" },
        { label: "Dia 24", state: "empty" },
        { label: "Dia 25", state: "empty" },
        { label: "Dia 26", state: "empty" },
        { label: "Dia 27", state: "empty" },
        { label: "Dia 28", state: "empty" },
        { label: "Dia 29", state: "empty" },
        { label: "Dia 30", state: "empty" },
        { label: "Dia 31", state: "empty" },
      ],
    };
  }) as {
    id: number;
    name: string;
    kpiId: number;
    mainCauses: { label: string; weight: number }[];
    data: {
      label: string;
      state: "fail" | "success" | "midpoint" | "disabled" | "empty";
    }[];
  }[];

  return (
    <>
      <BoardPage
        areaList={areaPerBoardListAlter}
        kpiList={kpiList}
        boardInfo={boardInfo}
        user={user}
      ></BoardPage>
    </>
  );
}
