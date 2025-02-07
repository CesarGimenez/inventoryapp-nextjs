"use client";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useCompanyStore } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { getMyTrucks } from "@/api/trucks/trucks.api";
import LoadingTable from "@/components/Loading/LoadingTable";

export default function Page() {
  const companyId = useCompanyStore((state) => state.defaultCompany?._id);
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["trucks", companyId],
    queryFn: () => getMyTrucks(companyId),
    staleTime: 1000 * 60 * 60,
    enabled: !!companyId,
    refetchOnWindowFocus: false
  });

  if(isFetching || isLoading || !data) {
    return (
        <div>
          <LoadingTable />
        </div>
    )
  }

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
