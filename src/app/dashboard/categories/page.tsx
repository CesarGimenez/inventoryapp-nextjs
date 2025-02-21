"use client";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useAuthStore } from "@/store";
import { useEffect } from "react";
import LoadingTable from "@/components/Loading/LoadingTable";
import { useCategories } from "@/hooks";

export default function Page() {
  const setLastPageVisited = useAuthStore((state) => state.setLastPageVisited);

  const { data, isLoading, refetch } = useCategories();
  
  useEffect(() => {
    setLastPageVisited("/dashboard/categories");
  }, [setLastPageVisited]);

  if(!data || isLoading) {
    return (
      <div>
        <LoadingTable />
      </div>
    )
  }

  return (
    <div>
      {
        !isLoading && data && (
          <DataTable columns={columns} data={data} refetch={refetch} />
        )
      }
    </div>
  );
}
