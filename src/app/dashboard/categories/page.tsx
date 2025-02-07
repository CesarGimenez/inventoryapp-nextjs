"use client";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore, useCompanyStore } from "@/store";
import { getMyCategories } from "@/api/categories/categories.api";
import { useEffect } from "react";
import LoadingTable from "@/components/Loading/LoadingTable";

export default function Page() {
  const companyId = useCompanyStore((state) => state.defaultCompany?._id);
  const setCategories = useCompanyStore((state) => state.setCategories);

  const setLastPageVisited = useAuthStore((state) => state.setLastPageVisited);
  
  useEffect(() => {
    setLastPageVisited("/dashboard/categories");
  }, [setLastPageVisited]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["categories", companyId],
    queryFn: async () => {
      const categories = await getMyCategories(companyId);
      setCategories(categories?.map((category: any) => {
        return {
          _id: category._id,
          name: category.name,
        }
      }));
      return categories;
    },
    staleTime: 1000 * 60 * 60,
    enabled: !!companyId,
    refetchOnWindowFocus: false
  });

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
