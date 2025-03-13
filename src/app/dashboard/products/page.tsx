"use client";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import LoadingTable from "@/components/Loading/LoadingTable";
import { useCategories, useProducts } from "@/hooks";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuthStore, useCompanyStore } from "@/store";
import { File } from "lucide-react";
import { getProductsReport } from "@/api/products/products.api";

export default function Page() {
  const { data, isLoading, refetch, isFetching } = useProducts();
  const { data: categories, isLoading: isLoadingCategories } = useCategories();

  const companyId = useCompanyStore((state) => state.defaultCompany?._id);
  const user = useAuthStore((state) => state.user);

  const [selectCategory, setSelectCategory] = useState(null);

  const filteredProductsByCategory = data?.filter((product: any) => {
    if (selectCategory === "TODOS") return true;
    return product.category === selectCategory;
  });

  const handleSelectCategory = (category: any) => {
    setSelectCategory(category);
    return;
  };

  if (!["PROPIETARIO", "ADMINISTRADOR"].includes(user?.type as string)) {
    return (
      <div>
        <p>Acceso denegado</p>
      </div>
    );
  }

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
        <div className="flex flex-row justify-between">
          <div className="mb-4 flex items-center gap-2 flex-wrap">
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
                variant={
                  selectCategory === category.name ? "default" : "outline"
                }
                onClick={() => handleSelectCategory(category.name)}
              >
                <span>{category.name}</span>
              </Button>
            ))}
          </div>
          <div>
            <Button
              className={`hidden ${data.length > 0 && "md:flex"} items-center`}
              onClick={() => getProductsReport(companyId)}
            >
              <File className="mr-2" /> Exportar PDF
            </Button>
          </div>
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
