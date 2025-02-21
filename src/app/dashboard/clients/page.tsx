"use client";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useAuthStore } from "@/store";
import { useEffect } from "react";
import LoadingTable from "@/components/Loading/LoadingTable";
import { useClients } from "@/hooks";

export default function Page() {
  const setLastPageVisited = useAuthStore((state) => state.setLastPageVisited);

  const { data, isLoading, refetch, isFetching } =  useClients();
    
    useEffect(() => {
      setLastPageVisited("/dashboard/products");
    }, [setLastPageVisited]);

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
