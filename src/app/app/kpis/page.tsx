import { auth } from "@/lib/auth";
import KpisPage from "./clientpage";
import { redirect } from "next/navigation";
import { db as database } from "@/db";
import { kpis } from "@/db/schema";

export default async function BooardPageSuspensed() {
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

  return (
    <>
      <KpisPage user={user}></KpisPage>
    </>
  );
}
