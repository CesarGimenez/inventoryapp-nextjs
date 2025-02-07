'use client'

import { Button } from "@/components/ui/button";
import { useCompanyStore } from "@/store";
import { useRouter } from "next/navigation";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { usePayment } from "./usePayment";
import LoadingTable from "@/components/Loading/LoadingTable";

export default function Page() {
    const router = useRouter();
    const redirect = () => {
        router.push("/dashboard/new-payment");
    }
    const { data, isLoading, refetch} = usePayment()

    if(isLoading || !data) {
      return (
          <div>
            <LoadingTable />
          </div>
      )
    }

  return (
    <div>
      <Button onClick={redirect}>Nueva venta</Button>
      {
        !isLoading && (
          <DataTable columns={columns} data={data} refetch={refetch} />
        )
      }
    </div>
  );
}