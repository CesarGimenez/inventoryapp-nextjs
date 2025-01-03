// components/Dashboard.js

"use client";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChartComponent } from "@/components/Charts/PieChart";
import { Truck } from "lucide-react";
import { Text } from "@/components/Typography/Text";
import { useCompanyStore } from "@/store";

import NotDataDashboard from '../../../assets/icons/not-data-dashboard.svg';

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getAnalyticsDashboard } from "./api";

const latestWithdrawals = [
  {
    driver: "Juan Pérez",
    registrar: "Ana Gómez",
    plate: "ABC-123",
    brand: "Ford",
    timeAgo: "2 horas",
  },
  {
    driver: "Luis Martínez",
    registrar: "Carlos Rodríguez",
    plate: "XYZ-456",
    brand: "Chevrolet",
    timeAgo: "5 horas",
  },
  {
    driver: "María López",
    registrar: "Pedro Fernández",
    plate: "LMN-789",
    brand: "Toyota",
    timeAgo: "1 día",
  },
];

const Dashboard = () => {
  const { defaultCompany } = useCompanyStore((state) => state);
  const companyId = defaultCompany?._id

  const { data, isFetching } = useQuery({
    queryKey: ['total-amount', companyId],
    queryFn: () => getAnalyticsDashboard(companyId),
    enabled: !!companyId
  })

  return (
    <div className="p-6">
      <Text>Dashboard</Text>

      {!defaultCompany ? (
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-center text-lg text-gray-500">Todavia no has creado una empresa, te invitamos a crearla ☝🏻</p>
          <Image src={NotDataDashboard} alt="Sin Datos" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tarjeta de Estadísticas */}
            <Card>
              <CardHeader>
                <h1 className="text-lg font-bold text-primary">Total Ventas</h1>
              </CardHeader>
              <CardContent>
                <h1 className="text-2xl">{isFetching ? '$0' : !data?.totalSelled ? '$0' : data.totalSelled}</h1>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h1 className="text-lg font-bold text-primary">
                  Productos disponibles
                </h1>
              </CardHeader>
              <CardContent>
                <h1 className="text-2xl">{!data?.totalProducts ? '0' : data.totalProducts}</h1>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h1 className="text-lg font-bold text-primary">
                  Clientes Activos
                </h1>
              </CardHeader>
              <CardContent>
                <h1 className="text-2xl">{!data?.totalClients ? '0' : data.totalClients}</h1>
              </CardContent>
            </Card>
          </div>

          {
            data?.paymentsPerMonth?.chartData?.length > 0 && (
              <div className="mt-8 w-1/2">
                <h1 className="text-xl mb-4">Ventas Mensuales</h1>
                <PieChartComponent data={data?.paymentsPerMonth}/>
              </div>
            )
          }
         

          <div className="mt-8">
            <h1 className="text-xl mb-4">Últimos Retiros en el Galpón</h1>
            <div className="grid grid-cols-1 gap-6">
              {latestWithdrawals.map((withdrawal, index) => (
                <div
                  key={index}
                  className="flex items-center p-4 bg-white shadow-md rounded-lg"
                >
                  <Truck className="w-10 h-10 text-gray-600 mr-4" />
                  <div className="flex-grow">
                    <h3 className="font-bold">{withdrawal.driver}</h3>
                    <p className="text-gray-600">
                      Registrado por: {withdrawal.registrar}
                    </p>
                    <p className="text-gray-600">Placa: {withdrawal.plate}</p>
                    <p className="text-gray-600">Marca: {withdrawal.brand}</p>
                    <p className="text-gray-500">Hace {withdrawal.timeAgo}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h1 className="text-xl mb-4">Productos Recientes</h1>
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border">Nombre</th>
                  <th className="py-2 px-4 border">Cantidad</th>
                  <th className="py-2 px-4 border">Precio</th>
                  <th className="py-2 px-4 border">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {/* Aquí puedes mapear los productos */}
                {Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border">Producto {index + 1}</td>
                    <td className="py-2 px-4 border">10</td>
                    <td className="py-2 px-4 border">$20.00</td>
                    <td className="py-2 px-4 border">
                      <Button variant="outline">Editar</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
