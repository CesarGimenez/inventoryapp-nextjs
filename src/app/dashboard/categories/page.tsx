"use client";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useQuery } from "@tanstack/react-query";
import { useCompanyStore } from "@/store";
import { getMyCategories } from "@/api/categories/categories.api";

export default function Page() {
  const companyId = useCompanyStore((state) => state.defaultCompany?._id);
  const setCategories = useCompanyStore((state) => state.setCategories);
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
