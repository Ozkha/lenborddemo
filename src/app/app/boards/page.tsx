import { redirect } from "next/navigation";
import BoardsPage from "./clientpage";
import { auth } from "@/lib/auth";

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

  const boardlist: {
    name: string;
    id: number;
  }[] = [{ name: "Flexoemtro", id: 1 }];

  // TODO: El user ya esta listo, seguir con lo que sigue de aqui
  // Tal vez primero establecer el type de user.
  return (
    <>
      <BoardsPage user={user} boardlist={boardlist}></BoardsPage>
    </>
  );
}
