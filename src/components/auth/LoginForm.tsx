"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { LoginApi } from "@/api/auth/auth.api";
import { useToast } from "../ui/use-toast";
import { useAuthStore, useCompanyStore } from "@/store";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("Introduce un email válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const router = useRouter();
  const setLogin = useAuthStore((state) => state.login);
  const { setCompany, setCompanies } = useCompanyStore((state) => state);

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: LoginFormData) => {
      return await LoginApi(data);
    },
    onSuccess: (data) => {
    //   setLogin(data);
      toast({
        variant: "success",
        title: "Inicio de sesión exitoso",
        description: "Bienvenido de nuevo!",
      });
      setLogin(data);
      setCompanies(data.companies);
      if(data.user?.type === 'PROPIETARIO') {
        setCompany(data.companies?.length ? data.companies[0] : null);
      } else {
        setCompany(data.user?.company)
      }
      
      router.push("/dashboard/home");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Oh no! Algo salio mal, intentalo de nuevo.",
        description: "Si el error persiste, contacta a soporte.",
      });
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    mutate(data);
    setIsLoading(false);
  };

  return (
    <Card className="max-w-lg w-full mx-auto mt-10 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-gray-800">
          Iniciar Sesión
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-gray-700">Correo Electrónico</label>
            <Input
              type="email"
              placeholder="ejemplo@correo.com"
              {...register("email")}
              className={cn("mt-1 w-full", errors.email && "border-red-500")}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-gray-700">Contraseña</label>
            <Input
              type="password"
              placeholder="Contraseña"
              {...register("password")}
              className={cn("mt-1 w-full", errors.password && "border-red-500")}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || isSubmitting}
          >
            {isLoading || isPending ? "Ingresando..." : "Ingresar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
