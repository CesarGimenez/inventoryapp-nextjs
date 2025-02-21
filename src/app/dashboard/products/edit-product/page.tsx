"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Suspense, useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSearchParams } from "next/navigation";
import { useProductDetail, useProducts } from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { updateProduct } from "@/api/products/products.api";

const FormSchema = z.object({
  is_active: z.boolean().default(true),
  name: z.string({
    required_error: "Por favor, introduce un nombre.",
    invalid_type_error: "El nombre debe ser una cadena de texto.",
  }).min(5, "El nombre debe tener al menos 5 caracteres.") ,
  company: z.string().optional(),
  description: z.string().optional(),
  price: z.number().min(0).default(0),
  // unit_price: z.number().min(0).default(0),
  quantity: z.number().min(0).default(0),
  category: z.string({
    required_error: "Por favor, selecciona una categoria.",
  })
});

type updateProductType = z.infer<typeof FormSchema>;

export default function Page () {
  return (
      <Suspense fallback={<div>Loading...</div>}>
        <EditProduct />
      </Suspense>
    );
}

const EditProduct = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const params = useSearchParams();

  const id = params.get("id");

  const { data, isLoading, isFetching, refetch } = useProductDetail(String(id));
  const { refetch: refetchProducts } = useProducts();

  useEffect(() => {
    if(data && form && !isLoading && !isFetching) {
      form.setValue("is_active", data.is_active);
      form.setValue("name", data.name);
      form.setValue("company", data.company);
      form.setValue("description", data.description);
      form.setValue("price", data.price);
      // form.setValue("unit_price", data.unit_price);
      form.setValue("quantity", data.quantity);
      form.setValue("category", data.category);
    }
  }, [data, form, isLoading, isFetching]);

  const { toast } = useToast();

  const { categories } = useCompanyStore((state) => state);

  const { mutate, isPending} = useMutation({
    mutationFn: async (data: updateProductType) => {
      return await updateProduct(id as string, data);
    },
    onSuccess: () => {
      toast({
        variant: "success",
        title: "Creada correctamente",
        description: "El producto se ha actualizado correctamente",
      });
      refetch();
      refetchProducts();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ha ocurrido un error al actualizar el producto",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    data.is_active = !!data.is_active
    mutate(data);
  };

  if(!data || isLoading || isFetching) {
    return (
      <div>
        <Skeleton className="h-4 w-full mb-2 mt-2" />
        <Skeleton className="h-4 w-full mb-2 mt-2" />
        <Skeleton className="h-4 w-full mb-2 mt-2" />
        <Skeleton className="h-4 w-full mb-2 mt-2" />
        <Skeleton className="h-4 w-full mb-2 mt-2" />
      </div>
    )
  }

  return (
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
                    placeholder="Precio unitario del producto"
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
                    onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => {
                return (
                <FormItem className="flex flex-col">
                  <FormLabel>Categoria</FormLabel>
                  <Select
                    value={field?.value?.length > 0 ? field.value : data.category}
                    onValueChange={field.onChange}
                    defaultValue={field?.value?.length > 0 ? field.value : data.category}
                    // value={field.value ? field.value : undefined}
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
              )}}
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
            <Button type="submit" size={"default"} disabled={isPending || !form.formState.isValid}>{isPending ? "Cargando..." : "Actualizar"}</Button>
          </form>
        </Form>
  );
}

