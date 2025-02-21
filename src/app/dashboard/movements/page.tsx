"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import LoadingTable from "@/components/Loading/LoadingTable";
import { useMovements } from "@/hooks";
import { useState } from "react";

const MOVEMENT_TYPES = ["INGRESO", "RETIRO", "TODOS"];

export default function Page() {
  const router = useRouter();
  const [selectType, setSelectType] = useState(null as string | null);
  const redirect = () => {
    router.push("/dashboard/movements/new-movement");
  };
  const { data, isLoading, refetch } = useMovements();

  const filteredByType = data?.filter((movement: any) => {
    if(selectType === 'TODOS') return true
    return movement.type === selectType;
  });

  const handleSelectCategory = (type: string) => {
    setSelectType(type);
    return;
  };

  if (isLoading || !data) {
    return (
      <div>
        <LoadingTable />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-8 mt-4">
        <Button onClick={redirect}>Nuevo movimiento</Button>
        <div className="flex items-center gap-2">
          {MOVEMENT_TYPES.map((type) => (
            <Button
              key={type}
              className="flex items-center gap-2"
              variant={selectType === type ? "default" : "outline"}
              onClick={() => handleSelectCategory(type)}
            >
              <span>{type}</span>
            </Button>
          ))}
        </div>
      </div>

      {!isLoading && (
        <DataTable
          columns={columns}
          data={selectType ? filteredByType : data ?? []}
          refetch={refetch}
        />
      )}
    </div>
  );
}
