"use server";

import { db } from "@/db";
import { Status, UserService } from "@/core/UserService";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const validationSchema = z.object({
  userId: z.number(),
  status: z.nativeEnum(Status),
});

export async function changeStatus(props: z.infer<typeof validationSchema>) {
  const validatedFields = validationSchema.safeParse(props);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const database = await db;
  const userService = new UserService(database);

  await userService.changeStatus(
    validatedFields.data.userId,
    validatedFields.data.status
  );

  revalidatePath("/app/users");
}
