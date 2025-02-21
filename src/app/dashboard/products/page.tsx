"use client";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import LoadingTable from "@/components/Loading/LoadingTable";
import { useCategories, useProducts } from "@/hooks";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Page() {
  const { data, isLoading, refetch, isFetching } = useProducts();
  const { data: categories, isLoading: isLoadingCategories } = useCategories();

  const [selectCategory, setSelectCategory] = useState(null);

  const filteredProductsByCategory = data?.filter((product: any) => {
    if (selectCategory === "TODOS") return true;
    return product.category === selectCategory;
  });

  const handleSelectCategory = (category: any) => {
    setSelectCategory(category);
    return;
  };

  if (isFetching || isLoading || !data) {
    return (
      <div className="p-6">
        <LoadingTable />
      </div>
    );
  }

  return (
    <div>
      {!isLoadingCategories && (
        <div className="mb-4 flex items-center gap-2">
          <Button
            variant={selectCategory === "TODOS" ? "default" : "outline"}
            onClick={() => handleSelectCategory("TODOS")}
          >
            TODOS
          </Button>
          {categories?.map((category: any) => (
            <Button
              key={category._id}
              className="flex items-center gap-2"
              variant={selectCategory === category.name ? "default" : "outline"}
              onClick={() => handleSelectCategory(category.name)}
            >
              <span>{category.name}</span>
            </Button>
          ))}
        </div>
      )}
      {!isLoading && data && (
        <DataTable
          columns={columns}
          data={selectCategory ? filteredProductsByCategory : data ?? []}
          refetch={refetch}
        />
      )}
    </div>
  );
}
