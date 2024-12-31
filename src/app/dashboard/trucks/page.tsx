"use client";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useCompanyStore } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { getMyTrucks } from "@/api/trucks/trucks.api";

export default function Page() {
  const companyId = useCompanyStore((state) => state.defaultCompany?._id);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["trucks", companyId],
    queryFn: () => getMyTrucks(companyId),
  });

  return (
    <div>
      {
        !isLoading && (
          <DataTable columns={columns} data={data} refetch={refetch} />
        )
      }
    </div>
  );
}
