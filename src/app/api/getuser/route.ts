import { db as database } from "@/db";
import { users } from "@/db/schema";
import { sql } from "drizzle-orm";

// TODO: Hacer mas seguro este endpoint, que no seleccione el usuario, sino que se encargue directamente de verificar
// si esta correcto o no lo ingresado, y despues regresara solo la informaion necesaria.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const username = searchParams.get("username");

  const dbb = await database;

  const [userFetched] = await dbb
    .select()
    .from(users)
    .where(sql`${users.username}=${username}`);

  if (!userFetched) {
    return new Response(null);
  }

  return Response.json(userFetched);
}
