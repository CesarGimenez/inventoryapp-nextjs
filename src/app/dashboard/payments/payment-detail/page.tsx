"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense } from "react";
import { usePayment } from "../usePayment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "lucide-react";
import { differenceInDays, format } from "date-fns";
import { Separator } from "@radix-ui/react-select";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentDetail />
    </Suspense>
  );
};

const PaymentDetail = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { dataDetail: paymentDetail } = usePayment(id as string);

  const router = useRouter();

  console.log(paymentDetail?.payment_details)
  return (
    <div>
      <Button onClick={() => router.push("/dashboard/payments")}>Regresar</Button>
      {paymentDetail && (
        <Card className="w-full max-w-2xl mx-auto p-4 shadow-lg rounded-2xl bg-white">
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle className="text-xl font-bold text-primary">
                Detalle de Pago
              </CardTitle>
              <Button>Imprimir factura</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Monto: </span>
                <div className="flex gap-2">
                  ${Number(paymentDetail.total).toFixed(2)}{" "}
                  <Badge className="text-lg"></Badge>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Método:</span>
                <span>{paymentDetail.payment_method}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Fecha de creacion:</span>
                <span>
                  {format(
                    new Date(paymentDetail.createdAt),
                    "dd/MM/yyyy HH:mm"
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Estatus de pago:</span>
                <span
                  className={`font-medium ${
                    paymentDetail.status === "Pagado"
                      ? "text-green-500"
                      : paymentDetail.status === "Pendiente"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  {paymentDetail.status}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Fecha de pago:</span>
                <span
                  className={`font-medium ${
                    !paymentDetail.payment_date &&
                    paymentDetail.status === "Pendiente"
                      ? "text-red-500"
                      : ""
                  }`}
                >
                  {paymentDetail.payment_date ? (
                    format(
                      new Date(paymentDetail.payment_date),
                      "dd/MM/yyyy HH:mm"
                    )
                  ) : (
                    <>
                      No pagado{" "}
                      {paymentDetail.createdAt &&
                        differenceInDays(
                          new Date(),
                          new Date(paymentDetail.createdAt)
                        ) > 3 && (
                          <span>
                            -{" "}
                            {differenceInDays(
                              new Date(),
                              new Date(paymentDetail.createdAt)
                            )}{" "}
                            días sin pagar
                          </span>
                        )}
                    </>
                  )}
                </span>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-2 text-primary">
                  Cliente
                </h3>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage
                      src={paymentDetail?.client?.avatar}
                      alt={paymentDetail?.client?.name}
                    />
                    <AvatarFallback>
                      {paymentDetail.client.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{paymentDetail?.client?.name}</p>
                    <p className="text-sm text-gray-500">
                      {paymentDetail?.client?.address}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-2 text-primary">
                  Vendedor
                </h3>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage
                      src={paymentDetail?.seller?.avatar}
                      alt={paymentDetail?.seller?.name}
                    />
                    <AvatarFallback>
                      {paymentDetail?.seller?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{paymentDetail?.seller?.name}</p>
                    <p className="text-sm text-gray-500">
                      {paymentDetail?.seller?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Detalle de pago */}
              <div>
                <h3 className="text-lg font-semibold mb-2 text-primary">Detalle de Pago</h3>
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Producto
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Cantidad
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Precio
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentDetail?.payment_details?.length > 0 &&
                      paymentDetail?.payment_details?.map(
                        (detail: any, index: number) => (
                          <tr key={index} className="border border-gray-300">
                            <td className="border border-gray-300 px-4 py-2">
                              {detail?.product?.name}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {detail?.quantity}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              ${Number(detail?.product?.price).toFixed(2)}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              ${Number(detail?.price).toFixed(2)} {detail?.discount > 0 && `(-${detail?.discount}%)`}
                            </td>
                          </tr>
                        )
                      )}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Page;
