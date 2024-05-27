import { auth } from "@/lib/auth";
import BoardPage from "./clientpage";
import { redirect, useSearchParams } from "next/navigation";
import { db as database } from "@/db";
import { boards } from "@/db/schema";
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

  return (
    <>
      <BoardPage boardInfo={boardInfo} user={user}></BoardPage>
    </>
  );
}
