"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function checkAuth() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  }

  return data.user;
}
