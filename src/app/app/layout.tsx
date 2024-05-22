import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { auth } from "@/lib/auth";
import {
  CircleUser,
  Gauge,
  ListTodo,
  Package2,
  PanelLeftOpen,
  Plus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { db as database } from "@/db";
import { boards } from "@/db/schema";
import { sql } from "drizzle-orm";
import { addBoard } from "@/actions/addboard";
import Header from "@/components/header";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Verificar si si revalida el state de la lista de board aunque no se este en la pagina de boards
  const session = await auth();

  const user = session!.user;
  const db = await database;
  const boardList = await db
    .select()
    .from(boards)
    .where(sql`${boards.companyId}=${user.companyId}`);

  return (
    <Header user={user} boardList={boardList}>
      {children}
    </Header>
  );
}
