"use server";

import { db } from "@/db";
import { z } from "zod";
import { UserService } from "@/services/UserService";

const validationSchema = z.object({
  userId: z.number(),
  newPassword: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "La contraseña debe tener al menos una letra mayúscula")
    .regex(/[0-9]/, "La contraseña debe tener al menos un número"),
});

export async function changePassword(props: z.infer<typeof validationSchema>) {
  const validatedFields = validationSchema.safeParse(props);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const database = await db;
  const userService = new UserService(database);

  await userService.changePassword(
    validatedFields.data.userId,
    validatedFields.data.newPassword
  );
}
