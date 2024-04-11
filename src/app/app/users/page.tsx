"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { CheckIcon, Ellipsis, PlusCircleIcon } from "lucide-react";
import { useState } from "react";

type FacetedFilterProps = {
  title: string;
  options: string[];
};
function FacetedFilter({ title, options }: FacetedFilterProps) {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"outline"} size={"sm"} className="h-8 border-dashed">
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          {title}

          {selectedValues.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant={"secondary"}
                className="rounded-sm px-1 font-normal"
              >
                {selectedValues.length}
              </Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>Sin resultados</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.includes(option);
                return (
                  <CommandItem
                    key={"key" + option}
                    onSelect={() => {
                      if (isSelected) {
                        setSelectedValues(
                          selectedValues.filter((optionh) => optionh !== option)
                        );
                      } else {
                        setSelectedValues([...selectedValues, option]);
                      }
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <CheckIcon className={cn("h-4 w-4")} />
                    </div>
                    <span>{option}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default function UsersPage() {
  const [usersList, setUsersList] = useState([
    {
      name: "Pedro Garza",
      user: "Pedrogz",
      rol: "administrador",
      estado: "activo",
    },
    {
      name: "Armando Lopez",
      user: "ARML",
      rol: "trabajador",
      estado: "activo",
    },
  ]);

  const boardOptions = [
    "Xbox260",
    "Flexometro linter",
    "Llantas inflables",
    "B1: Flexometro",
    "B2: Flexometro",
  ];

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <CardTitle>Usuarios</CardTitle>
          <CardDescription>Manejador de roles de usuarios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full flex justify-end">
            <Dialog>
              <DialogTrigger>
                <Button>Nuevo Usuario</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nuevo Usuario</DialogTitle>
                </DialogHeader>
                <Label htmlFor="inputnombre" className="mt-2">
                  Nombre
                </Label>
                <Input
                  type="text"
                  id="inputnombre"
                  placeholder="Ej. Jose Ramirez"
                ></Input>

                <Label htmlFor="inputuser">Usuario</Label>
                <Input
                  type="text"
                  id="inputuser"
                  placeholder="Ej. josermz / JOSERZ / JOSErm"
                ></Input>

                <Input
                  type="password"
                  id="inputpassword"
                  placeholder="Contraseña"
                ></Input>

                <Label htmlFor="selectrol">Rol inicial</Label>
                <Select>
                  <SelectTrigger id="selectrol">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Administrador</SelectItem>
                    <SelectItem value="dark">Manager de Tablero</SelectItem>
                    <SelectItem value="system">Trabajador</SelectItem>
                  </SelectContent>
                </Select>

                <FacetedFilter title="Tableros" options={boardOptions} />
                {/* TODO: En caso de que sea manager de tablero, que tableros seran */}
                {/* TODO: En caso de que sea trabajador, a que tableros estara asignado */}

                <Button className="mt-6" disabled>
                  Crear Usuario
                </Button>
              </DialogContent>
            </Dialog>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead className="hidden md:table-cell">Estado</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersList.map((user) => (
                <TableRow>
                  <TableCell>
                    <div>
                      <div className="font-medium text-sm md:text-base">
                        {user.name}
                      </div>
                      <div className="text-xs md:text-sm text-muted-foreground">
                        {user.user}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Select defaultValue={user.rol.toLowerCase()}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="administrador">
                          Administrador
                        </SelectItem>
                        <SelectItem value="manager">
                          Manager de Tablero
                        </SelectItem>
                        <SelectItem value="trabajador">Trabajador</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge
                      variant={
                        user.estado == "activo" ? "default" : "destructive"
                      }
                    >
                      {user.estado == "activo" ? "Activo" : "Bloqueado"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Ellipsis className="w-4 h-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>
                          <Badge
                            variant={
                              user.estado == "activo"
                                ? "default"
                                : "destructive"
                            }
                          >
                            {user.estado == "activo" ? "Activo" : "Bloqueado"}
                          </Badge>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Nueva Contrasenña</DropdownMenuItem>
                        <DropdownMenuItem>Reasignar Tableros</DropdownMenuItem>
                        <DropdownMenuItem>Bloquear / Activar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="w-full">
            <div className="text-xs text-muted-foreground">
              Se muestran <strong>1-10</strong> de <strong>32</strong> usuarios
            </div>
            <Pagination className="w-full mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
}
