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
import { useCompanyStore } from "@/store";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { createCategoryApi } from "@/api/categories/categories.api";

const FormSchema = z.object({
  status: z.boolean().default(true),
  name: z.string({
    required_error: "Por favor, introduce un nombre.",
  }),
  company: z.string().optional(),
});

type createCategoryType = z.infer<typeof FormSchema>;

interface Props {
  refetch: () => void
}

export const CategoriyModal = ({ refetch }: Props) => {
    const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const { toast } = useToast();

  const { setCompany, pushCompany, defaultCompany } = useCompanyStore((state) => state);

  const { mutate, isPending} = useMutation({
    mutationFn: async (data: createCategoryType) => {
      return await createCategoryApi(data);
    },
    onSuccess: () => {
      toast({
        variant: "success",
        title: "Creada correctamente",
        description: "La categoria se ha creado correctamente",
      });
      refetch();
      setOpen(false);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ha ocurrido un error al crear la categoria",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    data.company = defaultCompany?._id;
    data.status = !!data.status
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
          <DialogTitle>Nueva categoria</DialogTitle>
          <DialogDescription>
            En el siguiente formulario podras crear una nueva categoria.
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
                  <Input placeholder="Nombre de la categoria" {...field} />
                  <FormDescription>
                    Este sera el nombre que se visualizara de la categoria.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
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
            <Button type="submit" size={"lg"}>{"Crear"}</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

