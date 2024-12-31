"use client";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useCompanyStore } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { getMyProducts } from "@/api/products/products.api";

export default function Page() {
  const companyId = useCompanyStore((state) => state.defaultCompany?._id);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["products", companyId],
    queryFn: () => getMyProducts(companyId),
  });

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
