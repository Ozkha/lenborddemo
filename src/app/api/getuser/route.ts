import { db as database } from "@/db";
import { users } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const username = searchParams.get("username");

  const dbb = await database;

  let [userFetched] = await dbb
    .select()
    .from(users)
    .where(sql`${users.username}=${username}`);

  if (!userFetched) {
    return new Response(null);
  }

  return Response.json(userFetched);
}
