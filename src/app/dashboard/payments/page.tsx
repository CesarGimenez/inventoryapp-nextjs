'use client'

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { usePayment } from "./usePayment";
import LoadingTable from "@/components/Loading/LoadingTable";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store";
import { useCategories, useClients, useProducts } from "@/hooks";

export default function Page() {
    const router = useRouter();
    const [selectType, setSelectType] = useState("TODOS");
    const [filterPayments, setFilterPayments] = useState([])
    const user = useAuthStore((state) => state.user);

    const redirect = () => {
        router.push("/dashboard/new-payment");
    }
    useProducts();
    useClients();
    useCategories();
    const { data, isLoading, refetch} = usePayment()

    useEffect(() => {
      if(selectType === "TODOS" || !selectType) {
        setFilterPayments(data)
      }
      if(selectType === "Retraso") {
        setFilterPayments(data?.filter((payment: any) => payment.days_overdue > 0 && payment.status === "Pendiente"))
      }
    }, [selectType, data]);

    if(!["PROPIETARIO", "ADMINISTRADOR"].includes(user?.type as string)) {
      return (
        <div>
          <p>Acceso denegado</p>
        </div>
      )
    }

    if(isLoading || !data) {
      return (
          <div>
            <LoadingTable />
          </div>
      )
    }

  return (
    <div>
      <div className="flex items-center gap-4 flex-wrap">
        <Button onClick={redirect}>Nueva venta</Button>
        <div className="flex gap-2">
          <Button variant={selectType === "TODOS" ? "default" : "outline"} onClick={() => setSelectType("TODOS")}>TODOS</Button>
          <Button variant={selectType === "Retraso" ? "default" : "outline"} onClick={() => setSelectType("Retraso")}>
            <span className="flex gap-2 items-center">
              <Eye /> Con retraso
            </span>
          </Button>
        </div>
      </div>
      {!isLoading && (
        <DataTable columns={columns} data={selectType === "TODOS" ? data : filterPayments} refetch={refetch} />
      )}
    </div>
  );
}