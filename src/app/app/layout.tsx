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
  Gauge,
  ListTodo,
  Package2,
  PanelLeftOpen,
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
    { name: "Flexometro Linter", id: "asdj1273jasd712" },
    { name: "Tornos Acero", id: "jfhassn12as9an1" },
  ]);

  // TODO: Ver si puedo usar esto en useClient osea el cosa esta de login y protected routes
  // Mas bien para ponerlo en el layout de /app/app
  // Modificar el Middleware (creo que tambien seria necesario)
  // TODO: Agregar el boton de logout
  // TODO: Ver que onda con el registro de usuarios nuevos de una empresa, ya no en si la creacion de la cuetna de la empresa
  // aunque tambien verlo.

  return (
    <>
      <header className="sticky z-40 top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
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
                className=" flex items-center gap-4 pr-2.5 hover:text-foreground"
              >
                <Gauge className="h-5 w-5"></Gauge>
                KPI{"'"}s
              </Link>
              <p className="scroll-m-20 border-b pb-2 tex-sm text-muted-foreground first:mt-0 mt-4">
                Tableros
              </p>
              {boardsList.map((boardDetails) => (
                <Link
                  key={"board-" + boardDetails.id}
                  href={"/app/board?board=" + boardDetails.id}
                  className="text-muted-foreground"
                >
                  {boardDetails.name}
                </Link>
              ))}
              <Button
                variant={"ghost"}
                onClick={() => {
                  setBoardList([
                    ...boardsList,
                    { name: "Sin nombre", id: "kasdjashd123" },
                  ]);
                }}
              >
                <Plus className={"h-5 w-5 mr-2"}></Plus>
                Nuevo Tablero
              </Button>
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
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
