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
import { createUser } from "./api";

const FormSchema = z.object({
  active: z.boolean().default(true),
  name: z.string({
    required_error: "Por favor, introduce un nombre.",
  }),
  company: z.string().optional(),
  email: z.string({
    required_error: "Por favor, introduce un email.",
  }).email("Introduce un email válido"),
  type: z.string({
    required_error: "Por favor, introduce un tipo.",
  }),
  username: z.string({
    required_error: "Por favor, selecciona una categoria.",
  }),
  password: z.string({
    required_error: "Por favor, introduce una contraseña.",
  }),
  createdBy: z.string().optional(),
});

type createUserType = z.infer<typeof FormSchema>;

enum userTypeEnum {
  EMPLEADO = "EMPLEADO",
  VENDEDOR = "VENDEDOR",
  CONDUCTOR = "CONDUCTOR",
  ADMINISTRADOR = "ADMINISTRADOR",
}

const UserTypes = Object.values(userTypeEnum);

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
    mutationFn: async (data: createUserType) => {
      return await createUser(data);
    },
    onSuccess: () => {
      toast({
        variant: "success",
        title: "Creada correctamente",
        description: "El usuario se ha creado correctamente",
      });
      refetch();
      setOpen(false);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ha ocurrido un error al crear el usuario",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    data.company = defaultCompany?._id;
    data.active = !!data.active
    data.createdBy = user?._id
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
          <DialogTitle>Nuevo usuario</DialogTitle>
          <DialogDescription>
            En el siguiente formulario podras crear un nuevo usuario.
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
              name="username"
              render={({ field } ) => (
                <FormItem>
                  <FormLabel>Nombre de usuario</FormLabel>
                  <Input
                    placeholder="Nombre de usuario"
                    type="text"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field } ) => (
                <FormItem>
                  <FormLabel>Correo</FormLabel>
                  <Input
                    placeholder="Correo"
                    type="text"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field } ) => (
                <FormItem>
                  <FormLabel>Clave</FormLabel>
                  <Input
                    placeholder="Clave de usuario"
                    type="password"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tipo de usuario</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-[180px] ml-2">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {UserTypes.map((type) => (
                          <SelectItem
                            key={type}
                            value={type}
                          >
                            {type}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="active"
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

