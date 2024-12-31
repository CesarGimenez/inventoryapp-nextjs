"use client";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useQuery } from "@tanstack/react-query";
import { useCompanyStore } from "@/store";
import { getMyUsers } from "./api";

export default function Page() {
  const companyId = useCompanyStore((state) => state.defaultCompany?._id);
  const setWorkers = useCompanyStore((state) => state.setWorkers);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["workers", companyId],
    queryFn: async () => {
      const users = await getMyUsers(companyId);
      setWorkers(users?.map((user: any) => {
        return {
          _id: user._id,
          name: user.name,
        }
      }));
      return users;
    },
    // enabled: !!companyId,
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
