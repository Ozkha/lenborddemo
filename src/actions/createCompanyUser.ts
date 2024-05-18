"use server";

import { db as dbRaw } from "@/db";
import { comapnies, newCompany, newUser, users } from "@/db/schema";
import bcrypt from "bcryptjs";
import { z } from "zod";

const validationSchema = z.object({
  companyName: z
    .string({ invalid_type_error: "Nombre de empresa invalido" })
    .min(1),
  username: z
    .string({ invalid_type_error: "Nombre de Usuario invalido" })
    .min(5),
  password: z.string({ invalid_type_error: "Contraseña invalida" }).min(8),
});

export default async function createCompanyUser(formData: FormData) {
  const db = await dbRaw;

  const validatedFields = validationSchema.safeParse({
    companyName: formData.get("companyname"),
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const newCompany: newCompany = {
    name: validatedFields.data.companyName,
  };

  const newCompanyResponseHeader = await db
    .insert(comapnies)
    .values(newCompany);

  const salt = bcrypt.genSaltSync(10);
  const hashedPass = bcrypt.hashSync(validatedFields.data.password, salt);

  const newUser: newUser = {
    username: validatedFields.data.username,
    password: hashedPass,
    role: "admin",
    companyId: newCompanyResponseHeader[0].insertId,
  };

  const newUserResponseHeader = await db.insert(users).values(newUser);
  return {
    status: "OK",
  };
}
