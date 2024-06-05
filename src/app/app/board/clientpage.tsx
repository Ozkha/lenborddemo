"use client";

import DonughtProgress from "@/components/charts/donughtprogress";
import { Combobox } from "@/components/ui-compounded/combobox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookUp, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { changeBoardName } from "@/actions/changeBoardName";
import { toast } from "@/components/ui/use-toast";
import { min } from "drizzle-orm";
import { addAreaInBoard } from "@/actions/addArea";
import { date, year } from "drizzle-orm/mysql-core";
import { setKpiTrackingDayValue } from "@/actions/setKpiTackingDayValue";
import { useRouter } from "next/navigation";
import { addWhere } from "@/actions/addWhere";
import { addWho } from "@/actions/addWho";
import { addWhy } from "@/actions/addWhy";
import { create5wDump } from "@/actions/create5wDump";

type ClientBoardPageProps = {
  user: any;
  boardInfo: { id: number; name: string };
  kpiList: { id: number; name: string; fields: string[] }[];
  dateInfo: {
    month: number;
    year: number;
    maxDays: number;
  };
  areaList: {
    id: number;
    name: string;
    kpi: {
      id: number;
      name: string;
      fields: string[];
    };
    data: {
      status: "success" | "fail" | "mid" | "disabled" | "empty" | null;
      fieldValues: number[];
      day: number;
    }[];
  }[];
  whereList: { value: number; label: string }[];
  whoList: { value: number; label: string }[];
  whyList: { value: number; label: string }[];
};

const boardNameFormSchema = z.object({
  name: z.string().min(2, { message: "Es necesario un nombre valido" }),
});

const newAreaFormSchema = z.object({
  name: z.string().min(2, { message: "Es necesario un nombre valido" }),
  kpiId: z.string().transform((id) => Number(id)),
});

const updateKpiDayTrackFormSchema = z.object({
  values: z.number().array(),
  diaInhabil: z.boolean(),
  day: z.number(),
  month: z.number(),
  year: z.number(),
  areaId: z.number(),
  kpiId: z.number(),
});

const addNew5WhysEntrySchema = z.object({
  when: z.date({ message: "Es necesaria una fecha" }),
  what: z.string({ message: "Es necesario un 'que'" }),
  whereId: z.number({ message: "Es neceario un donde" }),
  whoId: z.number({ message: "Es necesario un quien" }),
  whyId: z.number({ message: "Es necesario un porque  o causa" }),
  whyDetails: z.string().optional(),
  areaId: z.number(),
});

export default function BoardPage({
  user,
  boardInfo,
  kpiList,
  dateInfo,
  areaList,
  whereList,
  whoList,
  whyList,
}: ClientBoardPageProps) {
  const router = useRouter();
  const boardNameForm = useForm<z.infer<typeof boardNameFormSchema>>({
    resolver: zodResolver(boardNameFormSchema),
    defaultValues: {
      name: boardInfo.name,
    },
  });

  function onSubmitChangeName(values: z.infer<typeof boardNameFormSchema>) {
    try {
      changeBoardName({
        name: values.name,
        boardId: boardInfo.id,
      });

      toast({
        title: "Okay!",
        description: "Nombre del tablero cambiado con exito",
      });
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No fue posbible cambiar el nombre del Tablero",
      });
    }
  }

  const newAreaForm = useForm<z.infer<typeof newAreaFormSchema>>({
    resolver: zodResolver(newAreaFormSchema),
    defaultValues: {
      name: "",
      kpiId: -1,
    },
  });

  function obSubmitNewAreaInBoard(values: z.infer<typeof newAreaFormSchema>) {
    try {
      addAreaInBoard({
        name: values.name,
        boardId: boardInfo.id,
        companyId: user.companyId,
        kpiId: values.kpiId,
      });
      newAreaForm.reset();

      toast({
        title: "Okay!",
        description: "Area del tablero creado con exito",
      });
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No fue posbible crear el area del Tablero",
      });
    }
  }

  const updateKpiDayTrackForm = useForm<
    z.infer<typeof updateKpiDayTrackFormSchema>
  >({
    resolver: zodResolver(updateKpiDayTrackFormSchema),
    defaultValues: {
      diaInhabil: false,
      values: [],
      month: dateInfo.month,
      year: dateInfo.year,
    },
  });

  function onSubmitUpdateKpiDayTrack(
    values: z.infer<typeof updateKpiDayTrackFormSchema>
  ) {
    const fecha = new Date(values.year, values.month - 1, values.day);
    const ahora = new Date();
    fecha.setHours(ahora.getHours());
    fecha.setMinutes(ahora.getMinutes());
    fecha.setSeconds(ahora.getSeconds());
    fecha.setMilliseconds(ahora.getMilliseconds());

    try {
      setKpiTrackingDayValue({
        date: fecha,
        areaId: values.areaId,
        kpiId: values.kpiId,
        diaInhabil: values.diaInhabil,
        values: values.values,
        companyId: user.companyId,
      });
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No fue posbible crear actualizar la informacion",
      });
    }
  }

  const addNew5WhysEntryForm = useForm<z.infer<typeof addNew5WhysEntrySchema>>({
    resolver: zodResolver(addNew5WhysEntrySchema),
  });

  function onSubmitAddNew5WhysEntry(
    values: z.infer<typeof addNew5WhysEntrySchema>
  ) {
    try {
      create5wDump({
        date: values.when,
        what: values.what,
        whereId: values.whereId,
        whoId: values.whoId,
        whyId: values.whyId,
        whyDetails: values.whyDetails,
        areaId: values.areaId,
        companyId: user.companyId,
      });
      addNew5WhysEntryForm.reset();
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No fue posbible registrar el 5w",
      });
    }
  }

  // const setTextSizeByCauseWeight = (weight: number) => {
  //   if (weight < 15) return "text-[15px]";
  //   if (weight < 17) return "text-[17px]";
  //   if (weight < 19) return "text-[19px]";
  //   if (weight < 21) return "text-[21px] font-semibold";
  //   if (weight < 23) return "text-[23px] font-semibold";
  //   if (weight < 25) return "text-[25px] font-semibold";
  //   if (weight < 27) return "text-[27px] font-semibold";
  //   if (weight <= 29) return "text-[29px] font-semibold";
  // };

  // DEL MODAL de KPI y dump info:
  const [areaModalIsOpen, setAreaModalIsOpen] = useState(false);
  const [areaModalInfo, setAreaModalInfo] = useState<{
    dayIndex: number;
    areaId: number;
    name: string;
    kpiId: number;
    fields: string[];
  }>();

  // Los 5w
  const [wheresList, setWheresList] = useState(whereList);
  const [whosList, setWhosList] = useState(whoList);
  const [whysList, setWhysList] = useState(whyList);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <p className="w-fit rounded-none border-0 bg-transparent scroll-m-20 text-2xl font-semibold tracking-tight">
          {boardInfo.name}
        </p>
        <Dialog>
          <DialogTrigger>
            <Pencil className="w-4 h-4 ml-2" />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nombre Tablero</DialogTitle>
            </DialogHeader>
            <Form {...boardNameForm}>
              <form
                onSubmit={boardNameForm.handleSubmit(onSubmitChangeName)}
                className="space-y-4"
              >
                <FormField
                  control={boardNameForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="w-full" type="submit">
                  Cambiar Nombre
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <Select
          onValueChange={(newVal) => {
            router.replace(
              "/app/board?board=" + boardInfo.id + "&month=" + newVal
            );
          }}
          defaultValue={dateInfo.month.toString()}
        >
          <SelectTrigger className="ml-1 w-fit rounded-none border-0 bg-transparent text-base text-muted-foreground">
            <SelectValue placeholder="Mes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Enero</SelectItem>
            <SelectItem value="2">Febrero</SelectItem>
            <SelectItem value="3">Marzo</SelectItem>
            <SelectItem value="4">Abril</SelectItem>
            <SelectItem value="5">Mayo</SelectItem>
            <SelectItem value="6">Junio</SelectItem>
            <SelectItem value="7">Julio</SelectItem>
            <SelectItem value="8">Agosto</SelectItem>
            <SelectItem value="9">Septiembre</SelectItem>
            <SelectItem value="10">Octubre</SelectItem>
            <SelectItem value="11">Noviembre</SelectItem>
            <SelectItem value="12">Diciembre</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-4 xl:grid-cols-4">
        {areaList.map((area) => (
          <Card key={"area-" + area.id}>
            <CardHeader className="pb-0">
              <Link href={"/app/area?area=" + area.id}>
                <Button className="w-fit p-0" variant={"ghost"}>
                  <BookUp className="w-5 h-5 text-muted-foreground" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <DonughtProgress
                data={area.data}
                maxLength={dateInfo.maxDays}
                title={area.name}
                onClickCell={(day) => {
                  const dayData = area.data.find((dat) => dat.day === day);

                  setAreaModalInfo({
                    dayIndex: day,
                    areaId: area.id,
                    name: area.name,
                    kpiId: area.kpi.id,
                    fields: area.kpi.fields,
                  });

                  updateKpiDayTrackForm.setValue("values", []);
                  updateKpiDayTrackForm.setValue("diaInhabil", false);
                  updateKpiDayTrackForm.setValue("day", day);

                  updateKpiDayTrackForm.setValue("areaId", area.id);
                  updateKpiDayTrackForm.setValue("kpiId", area.kpi.id);

                  addNew5WhysEntryForm.setValue("areaId", area.id);

                  const fecha = new Date(
                    dateInfo.year,
                    dateInfo.month - 1,
                    day
                  );
                  const ahora = new Date();
                  fecha.setHours(ahora.getHours());
                  fecha.setMinutes(ahora.getMinutes());
                  fecha.setSeconds(ahora.getSeconds());
                  fecha.setMilliseconds(ahora.getMilliseconds());
                  addNew5WhysEntryForm.setValue("when", fecha);

                  if (dayData) {
                    updateKpiDayTrackForm.setValue(
                      "values",
                      dayData.fieldValues
                    );

                    if (dayData.status === "disabled") {
                      updateKpiDayTrackForm.setValue("diaInhabil", true);
                    }
                  }

                  setAreaModalIsOpen(true);
                }}
              />
              <p className="text-center mt-2 text-muted-foreground">
                {area.kpi.name}
              </p>
              {/* <div className="flex flex-row justify-around gap-4 md:gap-10 xl:gap-12 my-6 ">
                {area.mainCauses.map((cause) => (
                  <div
                    key={"cause-" + cause.label}
                    className="flex flex-col items-center justify-end "
                  >
                    <p className={setTextSizeByCauseWeight(cause.weight)}>
                      {cause.weight}%
                    </p>
                    <p className="text-xs text-center">{cause.label}</p>
                  </div>
                ))}
                {area.mainCauses.length == 0 ? (
                  <div className="my-3">Sin Causas</div>
                ) : (
                  <></>
                )}
              </div> */}
              {/* <Alert className="">
                <ListTodo className="h-4 w-4" />
                <AlertTitle className="flex flex-row justify-between align-bottom items-baseline">
                  Ultima tarea completada
                  <span className="text-xs text-muted-foreground">
                    {area.lasttaskupdate}
                  </span>
                </AlertTitle>
              </Alert> */}
            </CardContent>
          </Card>
        ))}

        <Dialog>
          <DialogTrigger className="p-16">
            <div className="flex">
              <Plus className="h-5 w-5 mr-2"></Plus>
              Agregar KPI area
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva Area en el Tablero</DialogTitle>
            </DialogHeader>
            <Form {...newAreaForm}>
              <form
                onSubmit={newAreaForm.handleSubmit(obSubmitNewAreaInBoard)}
                className="space-y-4"
              >
                <FormField
                  control={newAreaForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del area</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej. Security, Calidad, People, Gasto"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={newAreaForm.control}
                  name="kpiId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>KPI</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {kpiList.map((kpi) => (
                            <SelectItem
                              key={"kpiL-" + kpi.id}
                              value={kpi.id.toString()}
                            >
                              {kpi.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="w-full" type="submit">
                  Agregar Area
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <Dialog
        onOpenChange={(val) => {
          setAreaModalIsOpen(val);
        }}
        open={areaModalIsOpen}
      >
        <DialogContent className="z-50">
          <DialogHeader>
            <DialogTitle>
              {areaModalInfo?.name}
              <span className="text-sm pl-1 text-muted-foreground">
                Dia {areaModalInfo?.dayIndex}
              </span>
            </DialogTitle>
            <Tabs defaultValue="kpi">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="kpi">KPI</TabsTrigger>
                <TabsTrigger value="5w">5W</TabsTrigger>
              </TabsList>
              <TabsContent value="kpi">
                <Form {...updateKpiDayTrackForm}>
                  <form
                    onSubmit={updateKpiDayTrackForm.handleSubmit(
                      onSubmitUpdateKpiDayTrack
                    )}
                    className="space-y-2 mt-4"
                  >
                    {areaModalInfo?.fields.map((fieldMetric, indx) => (
                      <FormField
                        control={updateKpiDayTrackForm.control}
                        name="values"
                        render={({ field }) => (
                          <FormItem key={"frm-fields-" + indx}>
                            <FormLabel>{fieldMetric}</FormLabel>
                            <FormControl>
                              <Input
                                onChange={(e) => {
                                  e.preventDefault();
                                  const val = e.target.value;
                                  const newValues = [...field.value];
                                  newValues[indx] = Number(val);
                                  field.onChange(newValues);
                                }}
                                value={field.value[indx] || 0}
                                defaultValue={
                                  !field.value[indx] ? 0 : undefined
                                }
                                type="number"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                    <div className="w-full flex items-center justify-between">
                      <FormField
                        control={updateKpiDayTrackForm.control}
                        name="diaInhabil"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>Dia Inhabil</FormLabel>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit">Guardar cambios</Button>
                    </div>
                  </form>
                </Form>
              </TabsContent>
              <TabsContent value="5w">
                <Form {...addNew5WhysEntryForm}>
                  <form
                    className="space-y-4 mt-4"
                    onSubmit={addNew5WhysEntryForm.handleSubmit(
                      onSubmitAddNew5WhysEntry
                    )}
                  >
                    <FormField
                      control={addNew5WhysEntryForm.control}
                      name="what"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Que?</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Lo que paso fue... / Pequeña descripcion"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={addNew5WhysEntryForm.control}
                      name="whereId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Donde?</FormLabel>
                          <FormControl>
                            <Combobox
                              data={wheresList}
                              value={
                                field.value ? field.value.toString() : undefined
                              }
                              onSelect={(val) => {
                                addNew5WhysEntryForm.setValue(
                                  "whereId",
                                  Number(val)
                                );
                              }}
                              placeholder="Selecciona lugar..."
                              placeholderOnSearch="Agregar lugar..."
                              emptyNode={(val) => (
                                <Button
                                  onClick={async (e) => {
                                    e.preventDefault();
                                    try {
                                      const newWhereId = await addWhere({
                                        label: val,
                                        companyId: user.companyId,
                                      });
                                      setWheresList([
                                        ...wheresList,
                                        { value: newWhereId, label: val },
                                      ]);
                                    } catch (e) {}
                                  }}
                                  variant={"ghost"}
                                >
                                  Agregar como opcion
                                </Button>
                              )}
                            ></Combobox>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={addNew5WhysEntryForm.control}
                      name="whoId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quien?</FormLabel>
                          <FormControl>
                            <Combobox
                              data={whosList}
                              value={
                                field.value ? field.value.toString() : undefined
                              }
                              onSelect={(val) => {
                                addNew5WhysEntryForm.setValue(
                                  "whoId",
                                  Number(val)
                                );
                              }}
                              placeholder="Selecciona persona..."
                              placeholderOnSearch="Agregar persona..."
                              emptyNode={(val) => (
                                <Button
                                  onClick={async (e) => {
                                    e.preventDefault();
                                    try {
                                      const newWhoId = await addWho({
                                        label: val,
                                        companyId: user.companyId,
                                      });
                                      setWhosList([
                                        ...whosList,
                                        { value: newWhoId, label: val },
                                      ]);
                                    } catch (e) {}
                                  }}
                                  variant={"ghost"}
                                >
                                  Agregar como opcion
                                </Button>
                              )}
                            ></Combobox>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={addNew5WhysEntryForm.control}
                      name="whyId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Porque? / Causa</FormLabel>
                          <FormControl>
                            <Combobox
                              data={whysList}
                              value={
                                field.value ? field.value.toString() : undefined
                              }
                              onSelect={(val) => {
                                addNew5WhysEntryForm.setValue(
                                  "whyId",
                                  Number(val)
                                );
                              }}
                              placeholder="Selecciona lugar..."
                              placeholderOnSearch="Agregar porque..."
                              emptyNode={(val) => (
                                <Button
                                  onClick={async (e) => {
                                    e.preventDefault();
                                    try {
                                      const newWhyId = await addWhy({
                                        label: val,
                                        companyId: user.companyId,
                                      });
                                      setWhysList([
                                        ...whysList,
                                        { value: newWhyId, label: val },
                                      ]);
                                    } catch (e) {}
                                  }}
                                  variant={"ghost"}
                                >
                                  Agregar como opcion
                                </Button>
                              )}
                            ></Combobox>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={addNew5WhysEntryForm.control}
                      name="whyDetails"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="Lo que paso fue... / Pequeña descripcion"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="mt-4">
                      Añadir registro
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </main>
  );
}
