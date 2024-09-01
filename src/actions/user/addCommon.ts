"use server";

import { z } from "zod";
import { Role, Status, SUser, UserService } from "../../services/UserService";
import { db } from "@/db";
import { revalidatePath } from "next/cache";

const validationSchema = z.object({
  name: z.string(),
  username: z.string().min(3, {
    message: "Es necesario un nombre de usuario de minimo 3 caracteres",
  }),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "La contraseña debe tener al menos una letra mayúscula")
    .regex(/[0-9]/, "La contraseña debe tener al menos un número"),
  role: z.enum(
    Object.values(Role).filter((val) => val !== Role.ADMIN) as [
      Exclude<Role, Role.ADMIN>,
      ...Exclude<Role, Role.ADMIN>[]
    ],
    {
      message: "Es necesario un rol, que no sea ADMIN",
    }
  ),
  status: z.nativeEnum(Status).optional().default(Status.ACTIVE),
  boardsIdResponsible: z.array(z.number()),
  companyId: z.number({ message: "Debe pertenecer a una empresa" }),
});

export async function addCommon(user: z.infer<typeof validationSchema>) {
  const validatedFields = validationSchema.safeParse(user);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const database = await db;
  const userService = new UserService(database);

  const userAdded = await userService.add(validatedFields.data);

  await userService.changeBoardResponsibilities(
    userAdded.id,
    validatedFields.data.boardsIdResponsible
  );

  revalidatePath("/app/users");
}
