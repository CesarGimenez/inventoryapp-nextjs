"use client";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useCompanyStore } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { getMyClients } from "./api";

export default function Page() {
  const companyId = useCompanyStore((state) => state.defaultCompany?._id);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["clients", companyId],
    queryFn: () => getMyClients(companyId),
    staleTime: 1000 * 60 * 60,
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
