"use client";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useAuthStore, useCompanyStore } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { getMyClients } from "./api";
import { useEffect } from "react";
import LoadingTable from "@/components/Loading/LoadingTable";

export default function Page() {
  const companyId = useCompanyStore((state) => state.defaultCompany?._id);

  const setLastPageVisited = useAuthStore((state) => state.setLastPageVisited);
    
    useEffect(() => {
      setLastPageVisited("/dashboard/products");
    }, [setLastPageVisited]);

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["clients", companyId],
    queryFn: () => getMyClients(companyId),
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
