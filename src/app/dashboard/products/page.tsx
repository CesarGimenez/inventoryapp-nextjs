"use client";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useCompanyStore } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { getMyProducts } from "@/api/products/products.api";
import LoadingTable from "@/components/Loading/LoadingTable";

export default function Page() {
  const companyId = useCompanyStore((state) => state.defaultCompany?._id);
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["products", companyId],
    queryFn: () => getMyProducts(companyId),
    staleTime: 1000 * 60 * 60,
    enabled: !!companyId,
    refetchOnWindowFocus: false
  });

  if(isFetching || isLoading || !data) {
    return (
      <div className="p-6">
        <LoadingTable />
      </div>
    )
  }

  return (
    <div>
      {
        !isLoading && data && (
          <DataTable columns={columns} data={data ?? []} refetch={refetch} />
        )
      }
    </div>
  );
}
