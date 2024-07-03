"use client";

import { get5wdump } from "@/actions/get5wdump";
import { DatePickerRange } from "@/components/ui-compounded/daterangepicker";
import MonthPicker from "@/components/ui-compounded/monthpicker";
import { Tracker } from "@/components/ui-compounded/tracker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { addDays, format } from "date-fns";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Copy,
  SquareCheck,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

const data = [
  {
    cause: "A",
    frecuency: 23,
  },
  {
    cause: "B",
    frecuency: 17,
  },
  {
    cause: "C",
    frecuency: 15,
  },
  {
    cause: "D",
    frecuency: 9,
  },
  {
    cause: "E",
    frecuency: 9,
  },
  {
    cause: "F",
    frecuency: 8,
  },
  {
    cause: "G",
    frecuency: 7,
  },
  {
    cause: "H",
    frecuency: 2,
  },
  {
    cause: "I",
    frecuency: 1,
  },
  {
    cause: "J",
    frecuency: 1,
  },
  {
    cause: "K",
    frecuency: 1,
  },
  {
    cause: "L",
    frecuency: 1,
  },
  {
    cause: "M",
    frecuency: 1,
  },
  {
    cause: "N",
    frecuency: 1,
  },
  {
    cause: "O",
    frecuency: 1,
  },
];

type AreaPageProps = {
  user: any;
  maxfivedumps: number;
  areaInfo: {
    id: number;
    name: number;
    board: {
      name: string;
    };
    kpi: {
      name: string;
    };
  };
  areaCurrentDateData: {
    date: Date;
    maxDays: number;
    data: {
      status: "success" | "fail" | "mid" | "disabled" | "empty" | null;
      fieldValues: number[];
      day: number;
    }[];
  };
  areaSelectedDateData: {
    date: Date;
    maxDays: number;
    data: {
      status: "success" | "fail" | "mid" | "disabled" | "empty" | null;
      fieldValues: number[];
      day: number;
    }[];
  };
  causes: {
    id: number;
    name: string;
    frecuency: number;
  }[];
  fivewhysFirstDump:
    | {
        date: Date;
        what: string;
        where: string | null;
        who: string | null;
        why: string | null;
        whyDetails: string | null;
      }
    | undefined;
};

export default function AreaPage({
  user,
  areaCurrentDateData,
  areaSelectedDateData,
  causes,
  areaInfo,
  maxfivedumps,
  fivewhysFirstDump,
}: AreaPageProps) {
  const router = useRouter();

  const [w5Page, setW5Page] = useState(0);
  const [current5why, setCurrent5Why] = useState(fivewhysFirstDump);
  if (areaInfo.id == null) {
    return (
      <main className="p-4 sm:px-6 sm:py-0">
        <div className="w-full">
          <p className="text-center text-xl mt-8">
            Es necesario haber seleccionada el area de algun tablero al entrar
            aqui
          </p>
        </div>
      </main>
    );
  }

  enum COLORS {
    "fail" = "#fe0000",
    "success" = "#00C49F",
    "mid" = "#FF8042",
    "disabled" = "#71717a",
    "empty" = "#cbd5e1",
  }

  return (
    <main className="p-4 sm:px-6 sm:py-0">
      <Tabs defaultValue="dashboard">
        <div className="flex flex-col md:flex-row py-4 sm:py-6 justify-between">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight ">
            {areaInfo.name}{" "}
            <span className="text-base text-muted-foreground">
              {areaInfo.board.name}
            </span>
          </h3>
          <TabsList className="mt-2 md:mt-0">
            <TabsTrigger value="dashboard" className="w-full">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="settings" className="w-full">
              Ajustes
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="dashboard">
          <MonthPicker
            defaultValue={new Date()}
            onClickAction={(datee) => {
              const newUrl =
                "/app/area?area=" +
                areaInfo.id +
                "&year=" +
                datee.getFullYear() +
                "&month=" +
                (datee.getMonth() + 1);
              router.replace(newUrl);
            }}
          />
          <div className="mt-2 grid flex-1 items-start gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
            <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                <Card className="sm:col-span-2">
                  <CardHeader className="pb-3">
                    <CardDescription className="font-semibold">
                      Mostrando:{" "}
                      {areaSelectedDateData.date.toLocaleString("defafult", {
                        month: "long",
                      })}
                      , {areaSelectedDateData.date.getFullYear()}
                    </CardDescription>{" "}
                  </CardHeader>
                  <CardContent>
                    <Tracker
                      data={(() => {
                        let finalData: { color: string; tooltip: string }[] =
                          [];

                        for (let i = 0; i < areaSelectedDateData.maxDays; i++) {
                          const val = areaSelectedDateData.data.find(
                            (dayData) => i + 1 === dayData.day
                          );
                          if (val) {
                            if (val.status == null) val.status = "empty";
                            finalData[i] = {
                              tooltip: val.day.toString(),
                              color: COLORS[val.status],
                            };
                          } else {
                            finalData[i] = {
                              tooltip: i.toString(),
                              color: COLORS.empty,
                            };
                          }
                        }
                        return finalData;
                      })()}
                    />
                  </CardContent>
                </Card>
                <Card className="sm:col-span-2">
                  <CardHeader className="pb-2">
                    <CardDescription>
                      Actual:{" "}
                      {areaCurrentDateData.date.toLocaleString("defafult", {
                        month: "long",
                      })}
                      , {areaCurrentDateData.date.getFullYear()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tracker
                      data={(() => {
                        let finalData: { color: string; tooltip: string }[] =
                          [];

                        for (let i = 0; i < areaCurrentDateData.maxDays; i++) {
                          const val = areaCurrentDateData.data.find(
                            (dayData) => i + 1 === dayData.day
                          );
                          if (val) {
                            if (val.status == null) val.status = "empty";
                            finalData[i] = {
                              tooltip: val.day.toString(),
                              color: COLORS[val.status],
                            };
                          } else {
                            finalData[i] = {
                              tooltip: i.toString(),
                              color: COLORS.empty,
                            };
                          }
                        }
                        return finalData;
                      })()}
                    />
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader className="px-7">
                  <CardTitle className="flex items-center justify-between">
                    <p>Causas</p>
                    {/* TODO: Cuando sigua las tasks */}
                    {/* <Dialog>
                      <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                        <SquareCheck className="w-4 h-4 mr-1" />
                        Asignar Accion
                      </DialogTrigger>
                      <DialogContent>
                        <div className="w-full flex gap-1">
                          <Badge>Security</Badge>
                          <Badge>Flexometro Linter</Badge>
                        </div>
                        <Input
                          className="text-lg border-0 border-b"
                          placeholder="Titulo"
                        />
                        <div className="flex justify-start">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"ghost"}
                                className={cn(
                                  "max-w-[280px] justify-start text-left font-normal",
                                  !date && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                                {dateA ? (
                                  format(dateA, "PPP")
                                ) : (
                                  <span className="text-sm text-muted-foreground">
                                    Sin fecha limite
                                  </span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={dateA}
                                onSelect={setDateA}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <Separator orientation="vertical" />
                          <div className="flex items-center">
                            <p className="text-xs text-gray-500 ml-2">👤</p>
                            <Select>
                              <SelectTrigger className="max-w-[180px] border-0">
                                <SelectValue placeholder="Responsable" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="joseperalez">
                                  Jose Peralez
                                </SelectItem>
                                <SelectItem value="yeraldi macias">
                                  Yeraldi Macias
                                </SelectItem>
                                <SelectItem value="Montoya Hector">
                                  Montoya Hector
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <Label htmlFor="description">Descripcion</Label>
                        <Textarea id="description" placeholder="..."></Textarea>
                        <Separator />
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="problemainput">Problema</Label>
                            <Input id="problemainput"></Input>
                          </div>
                          <div>
                            <Label htmlFor="causaselect">Causa</Label>
                            <Select>
                              <SelectTrigger
                                id="causaselect"
                                className="w-full"
                              >
                                <SelectValue placeholder="Selecciona la Causa" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="light">
                                  Mano Derecha
                                </SelectItem>
                                <SelectItem value="dark">
                                  Mano Derecha
                                </SelectItem>
                                <SelectItem value="system">
                                  Mano Derecha
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <Button disabled className="mt-4">
                          Asignar
                        </Button>
                      </DialogContent>
                    </Dialog> */}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row md:gap-4">
                  {causes.length > 0 ? (
                    <ResponsiveContainer
                      className="p-0 m-0 min-h-60 md:min-h-96"
                      width="100%"
                      height="100%"
                    >
                      <BarChart width={150} height={40} data={causes}>
                        <XAxis
                          dataKey="name"
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip />
                        <Bar
                          dataKey="frecuency"
                          fill="currentColor"
                          radius={[4, 4, 0, 0]}
                          className="fill-primary"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-muted-foreground">
                      No se han ingresado causas para ser graficadas
                    </div>
                  )}
                  <Separator
                    className="hidden md:inline-block"
                    orientation="vertical"
                  ></Separator>
                  <div>
                    <ul className="md:min-w-48 lg:min-w-60 gap-3">
                      {causes.map((cause, indx) => (
                        <li
                          key={"cause-l-" + cause.id}
                          className="flex items-center justify-between"
                        >
                          <div>
                            <span className="text-sm">{indx + 1}</span>
                            <span className="text-sm text-muted-foreground ml-3">
                              {cause.name}
                            </span>
                          </div>
                          <span className="text-sm">
                            {/* {((cause.frecuency / 97) * 100).toFixed(1)}% */}
                            {cause.frecuency}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Dialog>
                      <DialogTrigger className="w-full">
                        {causes.length > 0 ? (
                          <div className="mt-4 text-sm font-medium">
                            Mostrar Mas
                          </div>
                        ) : (
                          <></>
                        )}
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Causas</DialogTitle>
                          <DialogDescription>
                            Lista de todas las causas registradas en el rango de
                            tiempo
                          </DialogDescription>
                        </DialogHeader>
                        <ul className="md:min-w-48 lg:min-w-60 gap-3">
                          {causes.map((cause, indx) => (
                            <li
                              key={"cause-l-" + cause.id}
                              className="flex items-center justify-between"
                            >
                              <div>
                                <span className="text-sm">{indx + 1}</span>
                                <span className="text-sm text-muted-foreground ml-3">
                                  {cause.name}
                                </span>
                              </div>
                              <span className="text-sm">
                                {/* {((cause.frecuency / 97) * 100).toFixed(1)}% */}
                                {cause.frecuency}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <Card className="overflow-hidden">
                <CardHeader className="flex flex-row items-start bg-muted/50">
                  <div className="grid gap-0.5">
                    <CardTitle className="group flex items-center gap-2 text-lg">
                      5W
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">
                      {current5why
                        ? current5why.date.toLocaleDateString("es-MX", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "Vacio"}
                    </CardDescription>
                  </div>
                  <div className="ml-auto flex items-center gap-1">
                    <p className="mr-4 text-sm">
                      {w5Page + 1} / {maxfivedumps}
                    </p>
                    {current5why ? (
                      <Pagination className="ml-auto mr-0 w-auto">
                        <PaginationContent>
                          <PaginationItem>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-6 w-6"
                              onClick={async () => {
                                if (w5Page - 1 < 0) {
                                } else {
                                  const dumps = await get5wdump(
                                    w5Page - 1,
                                    areaInfo.id
                                  );
                                  if (dumps) {
                                    setCurrent5Why(dumps[0]);
                                  }
                                  setW5Page(w5Page - 1);
                                }
                              }}
                            >
                              <ChevronLeft className="h-3.5 w-3.5" />
                              <span className="sr-only">Previous Order</span>
                            </Button>
                          </PaginationItem>
                          <PaginationItem>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-6 w-6"
                              onClick={async () => {
                                if (w5Page + 1 > maxfivedumps) {
                                } else {
                                  const dumps = await get5wdump(
                                    w5Page + 1,
                                    areaInfo.id
                                  );
                                  if (dumps) {
                                    setCurrent5Why(dumps[0]);
                                  }
                                  setW5Page(w5Page + 1);
                                }
                              }}
                            >
                              <ChevronRight className="h-3.5 w-3.5" />
                              <span className="sr-only">Next Order</span>
                            </Button>
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    ) : (
                      <></>
                    )}
                  </div>
                </CardHeader>
                {current5why ? (
                  <CardContent className="p-6 text-sm">
                    <div className="grid gap-3">
                      <div className="font-semibold">Que?</div>
                      <p className="text-muted-foreground">
                        {current5why.what}
                      </p>
                    </div>
                    <Separator className="my-4" />
                    <div className="grid gap-3">
                      <div className="font-semibold">Donde?</div>
                      <div>
                        <Badge>{current5why.where}</Badge>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="grid gap-3">
                      <div className="font-semibold">Quien?</div>
                      <div>
                        <Badge>{current5why.who}</Badge>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="grid gap-3">
                      <div className="font-semibold">Porque / Causa?</div>
                      <div className="flex gap-2">
                        <Badge>{current5why.why}</Badge>
                      </div>
                      <p>Descripcion:</p>
                      <p className="text-muted-foreground text-sm">
                        {current5why.whyDetails}
                      </p>
                    </div>
                  </CardContent>
                ) : (
                  <></>
                )}
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="settings">
          <div className="w-full flex justify-center">
            <Card className="w-full max-w-[45rem]">
              <CardHeader>
                <CardTitle>Ajustes</CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="areaname">Nombre</Label>
                <Input
                  className="mb-6"
                  type="text"
                  id="areaname"
                  value={"Security"}
                ></Input>

                <Label htmlFor="areakpi">KPI</Label>
                <Select defaultValue="apple">
                  <SelectTrigger id="areakpi" className="w-full">
                    <SelectValue placeholder="Selecciona una KPI" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apple">
                      Margen de utilidad bruta
                    </SelectItem>
                    <SelectItem value="banana">Retorno de iversion</SelectItem>
                    <SelectItem value="blueberry">Productividad</SelectItem>
                    <SelectItem value="grapes">Clientes Adquiridos</SelectItem>
                  </SelectContent>
                </Select>

                <Button className="mt-8 w-full" variant={"destructive"}>
                  Eliminar
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
