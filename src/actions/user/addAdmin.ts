"use server";

import { z } from "zod";
import { Role, Status, UserService } from "../../core/UserService";
import { CompanyService } from "@/core/CompanyService";
import { db } from "@/db";

const validationSchema = z.object({
  username: z.string().min(3, {
    message: "Es necesario un nombre de usuario de minimo 3 caracteres",
  }),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "La contraseña debe tener al menos una letra mayúscula")
    .regex(/[0-9]/, "La contraseña debe tener al menos un número"),
  companyName: z
    .string()
    .min(3, { message: "La empresa debe poseer un nombre" }),
});

export async function addAdmin(user: z.infer<typeof validationSchema>) {
  const validatedFields = validationSchema.safeParse(user);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const database = await db;
  const companyService = new CompanyService(database);
  const userService = new UserService(database);

  const companyAdded = await companyService.add(
    validatedFields.data.companyName
  );

  await userService.add({
    name: "admin",
    username: validatedFields.data.username,
    password: validatedFields.data.password,
    role: Role.ADMIN,
    status: Status.ACTIVE,
    companyId: companyAdded.id,
  });
}
