"use client";

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
import {
  Bolt,
  CircleUser,
  ListTodo,
  Menu,
  Package2,
  Plus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [boardsList, setBoardList] = useState([
    "Flexometro linter",
    "Tornos de acero",
  ]);
  return (
    <>
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="#"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Package2 className="h-6 w-6" />
                <span className="sr-only">Acme Inc</span>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-4 pr-2.5 text-muted-foreground hover:text-foreground"
              >
                <ListTodo className="h-5 w-5"></ListTodo>
                Acciones
              </Link>
              <Link
                href="#"
                className="flex items-center gap-4 pr-2.5 text-muted-foreground hover:text-foreground"
              >
                <Users className="h-5 w-5"></Users>
                Usuarios
              </Link>
              <Link
                href="#"
                className="flex items-center gap-4 pr-2.5 hover:text-foreground"
              >
                <Bolt className="h-5 w-5"></Bolt>
                Ajustes
              </Link>
              <p className="scroll-m-20 border-b pb-2 tex-sm text-muted-foreground first:mt-0 mt-4">
                Tableros
              </p>
              {boardsList.map((boardName) => (
                <p key={boardName} className="text-muted-foreground">
                  {boardName}
                </p>
              ))}
              <Button
                variant={"ghost"}
                onClick={() => {
                  setBoardList([...boardsList, "Sin nombre"]);
                }}
              >
                <Plus className={"h-5 w-5 mr-2"}></Plus>
                Nuevo Tablero
              </Button>
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <p className="text-muted-foreground">Flexometro linter</p>
          <div className="ml-auto flex-1 sm:flex-initial"></div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Ajustes</DropdownMenuItem>
              <DropdownMenuItem>Soporte</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Salir de cuenta</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      {children}
    </>
  );
}
