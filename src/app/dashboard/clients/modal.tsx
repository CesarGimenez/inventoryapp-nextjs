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
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation } from "@tanstack/react-query";
import { useAuthStore, useCompanyStore } from "@/store";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "./api";

const FormSchema = z.object({
  is_active: z.boolean().default(true),
  name: z.string({
    required_error: "Por favor, introduce un nombre.",
  }),
  company: z.string().optional(),
  phone: z.string({
    required_error: "Por favor, introduce un numero de telefono.",
  }),
  address: z.string({
    required_error: "Por favor, introduce una direccion.",
  }),
  createdBy: z.string().optional(),
});

type createClientType = z.infer<typeof FormSchema>;

interface Props {
  refetch?: () => void
}

export const ProductModal = ({ refetch = () => {} }: Props) => {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const { toast } = useToast();

  const { defaultCompany } = useCompanyStore((state) => state);
  const { user } = useAuthStore((state) => state);

  const { mutate, isPending} = useMutation({
    mutationFn: async (data: createClientType) => {
      return await createClient(data);
    },
    onSuccess: () => {
      toast({
        variant: "success",
        title: "Creada correctamente",
        description: "El cliente se ha creado correctamente",
      });
      refetch();
      setOpen(false);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ha ocurrido un error al crear el cliente",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    data.company = defaultCompany?._id;
    data.is_active = !!data.is_active
    mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="ml-2">
          <CirclePlus className="mr-2 h-4 w-4" /> Agregar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nuevo cliente</DialogTitle>
          <DialogDescription>
            En el siguiente formulario podras crear un nuevo cliente.
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
                  <Input placeholder="Nombre" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field } ) => (
                <FormItem>
                  <FormLabel>Numero de telefono</FormLabel>
                  <Input
                    placeholder="Numero de telefono"
                    type="text"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field } ) => (
                <FormItem>
                  <FormLabel>Direccion</FormLabel>
                  <Input
                    placeholder="Direccion"
                    type="text"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Estatus</FormLabel>
                  <FormControl>
                    <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                    />
                </FormControl>
                <FormDescription>{field.value ? "Activo" : "Inactivo"}</FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size={"lg"}>{isPending ? "Cargando..." : "Guardar"}</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

