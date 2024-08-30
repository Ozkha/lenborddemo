"use server";

import { db as database } from "@/db";
import { newUser, userBoardResponsabiliy, users } from "@/db/schema";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

const validationSchema = z.object({
  name: z.string(),
  username: z.string().min(3, {
    message: "Es necesario un nombre de usuario de minimo 3 caracteres",
  }),
  password: z
    .string()
    .min(8, { message: "Contrasña requerida de minimo 8 caracteres" }),
  role: z.enum(["worker", "board_moderator"], {
    message: "Es necesario un rol",
  }),
  boardsIDsThatParticipate: z.array(z.number()),
  companyId: z.number(),
});

type addUserProps = {
  name: string;
  username: string;
  password: string;
  role: "worker" | "board_moderator";
  boardsIDsThatParticipate: number[];
  companyId: number;
};
export async function addUser({
  name,
  username,
  password,
  role,
  boardsIDsThatParticipate,
  companyId,
}: addUserProps) {
  const db = await database;

  const validatedFields = validationSchema.safeParse({
    name: name,
    username,
    password,
    role,
    boardsIDsThatParticipate,
    companyId,
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPass = bcrypt.hashSync(validatedFields.data.password, salt);

  const newUser: newUser = {
    name: validatedFields.data.name,
    username: validatedFields.data.username,
    password: hashedPass,
    role: validatedFields.data.role,
    companyId: validatedFields.data.companyId,
  };

  const newUserResponseHeader = await db.insert(users).values(newUser);

  const newUserInsertId = newUserResponseHeader[0].insertId;

  const valuesUserBaordResponsability =
    validatedFields.data.boardsIDsThatParticipate.map((boardId) => {
      return { userId: newUserInsertId, boardId: boardId };
    });

  if (valuesUserBaordResponsability.length > 0) {
    await db
      .insert(userBoardResponsabiliy)
      .values(valuesUserBaordResponsability);
  }

  revalidatePath("/app/users");
}
