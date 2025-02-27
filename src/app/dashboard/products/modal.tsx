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
import { createProduct } from "@/api/products/products.api";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const FormSchema = z.object({
  is_active: z.boolean().default(true),
  name: z.string({
    required_error: "Por favor, introduce un nombre.",
  }),
  company: z.string().optional(),
  description: z.string().optional(),
  price: z.number().default(0),
  // unit_price: z.number().default(0),
  quantity: z.number().default(0),
  category: z.string({
    required_error: "Por favor, selecciona una categoria.",
  })
});

type createProductType = z.infer<typeof FormSchema>;

interface Props {
  refetch?: () => void
}

export const ProductModal = ({ refetch = () => {} }: Props) => {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const { toast } = useToast();

  const { defaultCompany, categories } = useCompanyStore((state) => state);

  const { mutate, isPending} = useMutation({
    mutationFn: async (data: createProductType) => {
      return await createProduct(data);
    },
    onSuccess: () => {
      toast({
        variant: "success",
        title: "Creada correctamente",
        description: "El producto se ha creado correctamente",
      });
      refetch();
      form.reset();
      setOpen(false);
    },
    onError: (data) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Ha ocurrido un error al crear el producto, ${data.message}`,
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
          <DialogTitle>Nuevo producto</DialogTitle>
          <DialogDescription>
            En el siguiente formulario podras crear un nuevo producto.
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
                  <Input placeholder="Nombre del producto" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Descripción (Opcional)</FormLabel>
                  <Input
                    placeholder="Descripción del producto"
                    type="text"
                    onChange={(e) => onChange(e.target.value)}
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field: { onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Precio ($)</FormLabel>
                  <Input
                    placeholder="Precio del producto"
                    type="number"
                    step={0.01}
                    min={0}
                    onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="unit_price"
              render={({ field: { onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Precio unitario ($)</FormLabel>
                  <Input
                    placeholder="Precio unitario"
                    type="number"
                    step={0.01}
                    min={0}
                    onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <FormField
              control={form.control}
              name="quantity"
              render={({ field: { onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Cantidad</FormLabel>
                  <Input
                    placeholder="Cantidad del producto"
                    type="number"
                    min={0}
                    onChange={(e) => onChange(Number(e.target.value))}
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Categoria</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-[180px] ml-2">
                      <SelectValue placeholder="Categorias" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {categories.map((category) => (
                          <SelectItem
                            key={category._id}
                            value={category._id}
                          >
                            {category.name}
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

