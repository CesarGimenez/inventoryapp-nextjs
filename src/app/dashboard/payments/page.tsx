'use client'

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { usePayment } from "./usePayment";
import LoadingTable from "@/components/Loading/LoadingTable";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";

export default function Page() {
    const router = useRouter();
    const [selectType, setSelectType] = useState("TODOS");
    const [filterPayments, setFilterPayments] = useState([])
    const redirect = () => {
        router.push("/dashboard/new-payment");
    }
    const { data, isLoading, refetch} = usePayment()

    useEffect(() => {
      if(selectType === "TODOS" || !selectType) {
        setFilterPayments(data)
      }
      if(selectType === "Retraso") {
        setFilterPayments(data?.filter((payment: any) => payment.days_overdue > 0 && payment.status === "Pendiente"))
      }
    }, [selectType, data]);

    if(isLoading || !data) {
      return (
          <div>
            <LoadingTable />
          </div>
      )
    }

  return (
    <div>
      <div className="flex items-center gap-4">
        <Button onClick={redirect}>Nueva venta</Button>
        <Button variant={selectType === "TODOS" ? "default" : "outline"} onClick={() => setSelectType("TODOS")}>TODOS</Button>
        <Button variant={selectType === "Retraso" ? "default" : "outline"} onClick={() => setSelectType("Retraso")}>
          <span className="flex gap-2 items-center">
            <Eye /> Pagos con retraso
          </span>
        </Button>
      </div>
      {!isLoading && (
        <DataTable columns={columns} data={selectType === "TODOS" ? data : filterPayments} refetch={refetch} />
      )}
    </div>
  );
}