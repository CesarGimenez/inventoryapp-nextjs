"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CirclePlus } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useMutation } from "@tanstack/react-query";
import { createCompanyApi } from "@/api/company/company.api";
import { useAuthStore, useCompanyStore } from "@/store";
import { useToast } from "../ui/use-toast";
import { useState } from "react";

const companyTypes = [
  { label: "Restaurant", value: "RESTAURANT" },
  { label: "Hotel", value: "HOTEL" },
  { label: "Restaurant hotel", value: "RESTAURANT_HOTEL" },
  { label: "Cafeteria", value: "CAFETERIA" },
  { label: "Supermercado", value: "SUPERMERCADO" },
  { label: "Ferreteria", value: "FERRETERIA" },
  { label: "Charcuteria", value: "CHARCUTERIA" },
  { label: "Comida rapida", value: "FASTFOOD" },
  { label: "Tienda", value: "TIENDA" },
  { label: "Licoreria", value: "LICORERIA" },
  { label: "Panaderia", value: "PANADERIA" },
  { label: "Pasteleria", value: "PASTELERIA" },
  { label: "Carniceria", value: "CARNICERIA" },
  { label: "Almacen", value: "ALMACEN" },
  { label: "Otros", value: "OTRO" },
] as const;

const FormSchema = z.object({
  type: z.string({
    required_error: "Por favor, selecciona un tipo.",
  }),
  name: z.string({
    required_error: "Por favor, introduce un nombre.",
  }),
  owner: z.string().optional(),
});

type createCompanyType = z.infer<typeof FormSchema>;

export function CreateCompany() {
    const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const { toast } = useToast();

  const { user } = useAuthStore((state) => state);
  const { setCompany, pushCompany } = useCompanyStore((state) => state);

  const { mutate, isPending} = useMutation({
    mutationFn: async (data: createCompanyType) => {
      return await createCompanyApi(data);
    },
    onSuccess: (data) => {
      toast({
        variant: "success",
        title: "Creada correctamente",
        description: "La empresa se ha creado correctamente",
      });
      setCompany(data);
      pushCompany(data);
      setOpen(false);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ha ocurrido un error al crear la empresa",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    data.owner = user?._id;
    data.type = data.type.toUpperCase();
    mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <CirclePlus className="mr-2 h-4 w-4" /> Crear empresa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nueva empresa</DialogTitle>
          <DialogDescription>
            En el siguiente formulario podras crear una nueva empresa con datos
            como nombre y tipo.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <Input placeholder="Nombre de la empresa" {...field} />
                  <FormDescription>
                    Este sera el nombre que se visualizara de tu empresa.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tipo de empresa</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {companyTypes.map(({ label, value }) => (
                        <SelectItem
                          key={value}
                          value={value}
                          className="capitalize text-center"
                        >
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Este sera el tipo de empresa que gestionaras.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size={"lg"}>{isPending ? "Cargando..." : "Crear"}</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

