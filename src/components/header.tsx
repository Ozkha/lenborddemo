"use client";

import {
  CircleUser,
  Gauge,
  ListTodo,
  Package2,
  PanelLeftOpen,
  Plus,
  Users,
} from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import Link from "next/link";
import { addBoard } from "@/actions/addboard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { signOutServer } from "@/lib/signout";

type HeaderProps = {
  user: any;
  boardList: { id: number; name: string; companyId: number }[];
  children: React.ReactNode;
  hideSheet?: boolean;
};

export default function Header({
  user,
  boardList,
  children,
  hideSheet,
}: HeaderProps) {
  return (
    <>
      <header className="sticky z-40 top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        {!hideSheet && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <PanelLeftOpen className="h-5 w-5" />
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
                  href="/app/tasks"
                  className="flex items-center gap-4 pr-2.5 text-muted-foreground hover:text-foreground"
                >
                  <ListTodo className="h-5 w-5"></ListTodo>
                  Acciones
                </Link>
                <Link
                  href="/app/users"
                  className="flex items-center gap-4 pr-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Users className="h-5 w-5"></Users>
                  Usuarios
                </Link>
                <Link
                  href="/app/kpis"
                  className=" flex items-center gap-4 pr-2.5 text-muted-foreground hover:text-foreground" //When is selected, text-muted-foreground is deleted
                >
                  <Gauge className="h-5 w-5"></Gauge>
                  KPI{"'"}s
                </Link>
                <p className="scroll-m-20 border-b pb-2 tex-sm text-muted-foreground first:mt-0 mt-4">
                  Tableros
                </p>
                {boardList.map((boardDetails) => (
                  <Link
                    key={"board-" + boardDetails.id}
                    href={"/app/board?board=" + boardDetails.id}
                    className="text-muted-foreground"
                  >
                    {boardDetails.name}
                  </Link>
                ))}
                <Button
                  onClick={() => {
                    addBoard({
                      name: "sin nombre",
                      companyId: Number(user.companyId),
                    });
                  }}
                  variant={"ghost"}
                >
                  <Plus className={"h-5 w-5 mr-2"}></Plus>
                  Nuevo Tablero
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        )}

        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <div className="ml-auto flex-1 sm:flex-initial">
            {user.name || "Sin nombre"}
          </div>
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
              {/* <DropdownMenuItem>Soporte</DropdownMenuItem> */}
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <button
                  onClick={() => {
                    signOutServer("/login");
                  }}
                >
                  Salir de cuenta
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      {children}
    </>
  );
}
