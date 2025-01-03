'use client'

import { Button } from "@/components/ui/button";
import { useCompanyStore } from "@/store";
import { useRouter } from "next/navigation";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { usePayment } from "./usePayment";

export default function Page() {
    const router = useRouter();
    const redirect = () => {
        router.push("/dashboard/new-payment");
    }
    const companyId = useCompanyStore((state) => state.defaultCompany?._id)
    const { data, isLoading, refetch} = usePayment(companyId)

  return (
    <div>
      <Button onClick={redirect}>Nuevo Pago</Button>
      {
        !isLoading && (
          <DataTable columns={columns} data={data} refetch={refetch} />
        )
      }
    </div>
  );
}