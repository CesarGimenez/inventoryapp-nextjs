// components/Dashboard.js

"use client";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { AreaChartComponent } from "@/components/Charts/AreaChart";
import { Text } from "@/components/Typography/Text";
import { useAuthStore, useCompanyStore } from "@/store";

import NotDataDashboard from "../../../assets/icons/not-data-dashboard.svg";

import Image from "next/image";
import { BestClientsList } from "@/components/Charts/BestClientsList";
import Loading from "./loading";
import ProductSalesPieChart from "@/components/Charts/PieChartProduct";
import {
  useAnalytics,
  useCategories,
  useClients,
  useMovements,
  useProducts,
} from "@/hooks";
import { Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import { es } from "date-fns/locale";
import { redirect, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/utils";
import PieChartCategories from "@/components/Charts/PieChartCategories";

interface Movement {
  driver: string;
  createdAt: string;
  truck: {
    plate: string;
    name: string;
  };
  createdBy: string;
}

const Page = () => {
  const defaultCompany = useCompanyStore((state) => state.defaultCompany);
  useCategories();
  useClients();
  useProducts();

  if (defaultCompany?.type === "ALMACEN") {
    return <DashboardAlmacen />;
  } else {
    return <DashboardCommerce />;
  }
};

const DashboardAlmacen = () => {
  const { data, isLoading, isFetching } = useMovements();
  const { data: products } = useProducts();
  const [retiros, setRetiros] = useState<Movement[]>([]);
  const [ingresos, setIngresos] = useState<Movement[]>([]);

  useEffect(() => {
    if (data) {
      const retiros = data.filter(
        (mov: any) => mov.type?.toLowerCase() === "retiro"
      );
      const ingresos = data.filter(
        (mov: any) => mov.type?.toLowerCase() === "ingreso"
      );
      setRetiros(retiros);
      setIngresos(ingresos);
    }
  }, [data]);

  if (isFetching || isLoading || !data) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-6">
      <Text>Dashboard</Text>
      <div>
        <div className="mt-8">
          <h1 className="text-xl mb-4">Retiros recientes</h1>

          {retiros.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-4">
              <p className="text-center text-lg text-gray-500">
                No hay retiros registrados
              </p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-6">
            {retiros.length > 0 &&
              retiros.map((retiro, index) => (
                <div
                  key={index}
                  className="flex items-center p-4 bg-white shadow-md rounded-lg"
                >
                  <Truck className="w-10 h-10 text-gray-600 mr-4" />
                  <div className="flex-grow">
                    <h3 className="font-bold">{retiro.driver}</h3>
                    <p className="text-gray-600">
                      Registrado por: {retiro.createdBy}
                    </p>
                    <p className="text-gray-600">
                      Placa: {retiro.truck?.plate}
                    </p>
                    <p className="text-gray-600">
                      Vehiculo: {retiro.truck?.name}
                    </p>
                    <p className="text-gray-500">
                      {" "}
                      {formatDistanceToNowStrict(new Date(retiro.createdAt), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </p>
                  </div>
                </div>
              ))}
          </div>

          <h1 className="text-xl mb-4 mt-4">Ingresos recientes</h1>

          {ingresos.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-4">
              <p className="text-center text-lg text-gray-500">
                No hay retiros registrados
              </p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-6">
            {ingresos.length > 0 &&
              ingresos.map((ingreso, index) => (
                <div
                  key={index}
                  className="flex items-center p-4 bg-white shadow-md rounded-lg"
                >
                  <Truck className="w-10 h-10 text-gray-600 mr-4" />
                  <div className="flex-grow">
                    <h3 className="font-bold">{ingreso.driver}</h3>
                    <p className="text-gray-600">
                      Registrado por: {ingreso.createdBy}
                    </p>
                    <p className="text-gray-600">
                      Placa: {ingreso.truck?.plate}
                    </p>
                    <p className="text-gray-600">
                      Vehiculo: {ingreso.truck?.name}
                    </p>
                    <p className="text-gray-500">
                      {formatDistanceToNowStrict(new Date(ingreso.createdAt), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="mt-8">
          <h1 className="text-xl mb-4">Productos en inventario</h1>
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border">Nombre</th>
                <th className="py-2 px-4 border">Cantidad (Unidades)</th>
                <th className="py-2 px-4 border">Precio</th>
                <th className="py-2 px-4 border">Categoria</th>
                <th className="py-2 px-4 border">Actualizacion</th>
              </tr>
            </thead>
            <tbody>
              {products &&
                products
                  .sort((a: any, b: any) => b.updatedAt - a.updatedAt)
                  .map((product: any, index: number) => (
                    <tr key={index} className="hover:bg-gray-100">
                      <td className="py-2 px-4 border text-center">
                        {product.name}
                      </td>
                      <td className="py-2 px-4 border text-center">
                        {product.quantity}
                      </td>
                      <td className="py-2 px-4 border text-center">
                        ${product.price}
                      </td>
                      <td className="py-2 px-4 border text-center">
                        {product.category}
                      </td>
                      <td className="py-2 px-4 border text-center">
                        {formatDistanceToNowStrict(
                          new Date(product.updatedAt),
                          {
                            addSuffix: true,
                            locale: es,
                          }
                        )}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const DashboardCommerce = () => {
  const { defaultCompany } = useCompanyStore((state) => state);
  const { user } = useAuthStore((state) => state);
  const enabled =
    !!user?.type && ["PROPIETARIO", "ADMINISTRADOR"].includes(user?.type);

  const [selectedDate, setSelectedDate] = useState("CurrentYear");

  const { data, isLoading, isFetching, refetch } = useAnalytics(selectedDate);

  useEffect(() => {
    refetch();
  }, [selectedDate, refetch]);

  if (!enabled) {
    return (
      <div>
        <p>Acceso denegado</p>
      </div>
    );
  }

  if (isFetching || isLoading || !data) {
    return (
      <div className="p-6">
        <Text>Dashboard</Text>
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <Text>Dashboard</Text>

        <Select value={selectedDate} onValueChange={setSelectedDate}>
          <SelectTrigger className="w-[180px] ml-2">
            <SelectValue placeholder="Hoy" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="CurrentYear">Este año </SelectItem>
              <SelectItem value="CurrentMonth">Este mes</SelectItem>
              <SelectItem value="PreviousMonth">Mes anterior</SelectItem>
              <SelectItem value="CurrentWeek">Esta semana</SelectItem>
              <SelectItem value="PreviousWeek">Semana pasada</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {!defaultCompany ? (
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-center text-lg text-gray-500">
            Todavia no has creado una empresa, te invitamos a crearla ☝🏻
          </p>
          <Image src={NotDataDashboard} alt="Sin Datos" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tarjeta de Estadísticas */}
            <Card className="hover:bg-gray-100 hover:cursor-pointer">
              <CardHeader>
                <h1 className="text-lg font-bold text-primary">
                  Total Ventas Estimadas
                </h1>
              </CardHeader>
              <CardContent>
                <h1 className="text-2xl">
                  ${formatCurrency(!data?.totalSelled ? 0 : data.totalSelled)}
                </h1>

                <div className="flex flex-col justify-between mt-2">
                  <span className="text-green-600">
                    Pagado: $
                    {formatCurrency(!data?.totalPayed ? 0 : data.totalPayed)}
                  </span>
                  <span className="text-red-600">
                    Pendientes por pagar: $
                    {formatCurrency(
                      !data?.totalPending ? 0 : data.totalPending
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:bg-gray-100 hover:cursor-pointer">
              <CardHeader>
                <h1 className="text-lg font-bold text-primary">
                  Productos disponibles
                </h1>
              </CardHeader>
              <CardContent>
                <h1 className="text-2xl">
                  {!data?.totalProducts ? "0" : data.totalProducts}
                </h1>
              </CardContent>
            </Card>

            <Card className="hover:bg-gray-100 hover:cursor-pointer">
              <CardHeader>
                <h1 className="text-lg font-bold text-primary">
                  Clientes Activos
                </h1>
              </CardHeader>
              <CardContent>
                <h1 className="text-2xl">
                  {!data?.totalClients ? "0" : data.totalClients}
                </h1>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 lg:grid-cols-3">
            {data?.paymentsPerMonth?.chartData?.length > 0 &&
              selectedDate === "CurrentYear" && (
                <div className="mt-8">
                  <h1 className="text-xl mb-4">Ventas Mensuales</h1>
                  <AreaChartComponent data={data?.paymentsPerMonth} />
                </div>
              )}

            {data?.bestClients?.length > 0 && (
              <div className="mt-8">
                <h1 className="text-xl mb-4">Ventas por cliente</h1>
                <BestClientsList data={data?.bestClients} />
              </div>
            )}

            {data?.mostSelledProducts && data.mostSelledProducts.length > 0 && (
              <div className="mt-8">
                <h1 className="text-xl mb-4">Mas ventas por producto ($)</h1>
                <ProductSalesPieChart data={data.mostSelledProducts} />
              </div>
            )}

            {data?.mostSelledCategories && data.mostSelledCategories.length > 0 && (
              <div className="mt-8">
                <h1 className="text-xl mb-4">Mas ventas por categoria ($)</h1>
                <PieChartCategories data={data.mostSelledCategories} />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
