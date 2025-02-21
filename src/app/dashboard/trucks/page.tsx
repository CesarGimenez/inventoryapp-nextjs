"use client";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import LoadingTable from "@/components/Loading/LoadingTable";
import { useTrucks } from "@/hooks";

export default function Page() {
  const { data, isLoading, refetch, isFetching } = useTrucks();

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
