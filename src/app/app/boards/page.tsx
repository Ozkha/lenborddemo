import { redirect } from "next/navigation";
import BoardsPage from "./clientpage";
import { auth } from "@/lib/auth";
import { db as database } from "@/db";
import { boards } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export default async function BoardsPageS() {
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
  const boardList = await db
    .select()
    .from(boards)
    .where(sql`${boards.companyId}=${user.companyId}`);

  return (
    <>
      <BoardsPage user={user} boardlist={boardList}></BoardsPage>
    </>
  );
}
