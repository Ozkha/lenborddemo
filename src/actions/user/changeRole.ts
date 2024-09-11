"use server";

import { db } from "@/db";
import { Role, UserService } from "@/core/UserService";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const validationSchema = z.object({
  userId: z.number(),
  role: z.enum(
    Object.values(Role).filter((val) => val !== Role.ADMIN) as [
      Exclude<Role, Role.ADMIN>,
      ...Exclude<Role, Role.ADMIN>[]
    ],
    {
      message: "Es necesario un rol, que no sea ADMIN",
    }
  ),
});

export async function changeRole(props: z.infer<typeof validationSchema>) {
  const validatedFields = validationSchema.safeParse(props);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const database = await db;
  const userService = new UserService(database);

  await userService.changeRole(
    validatedFields.data.userId,
    validatedFields.data.role
  );

  revalidatePath("/app/users");
}
