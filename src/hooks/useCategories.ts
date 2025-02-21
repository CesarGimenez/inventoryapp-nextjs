import { getMyCategories } from "@/api/categories/categories.api";
import { useCompanyStore } from "@/store";
import { useQuery } from "@tanstack/react-query";

export const useCategories = () => {
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
        staleTime: 1000 * 60 * 60,
        enabled: !!companyId,
        refetchOnWindowFocus: false
      });

    return {
        data,
        isLoading,
        refetch
    }
}