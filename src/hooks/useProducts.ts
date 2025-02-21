import { getMyProducts } from "@/api/products/products.api";
import { useCompanyStore } from "@/store";
import { useQuery } from "@tanstack/react-query";

export const useProducts = () => {
  const companyId = useCompanyStore((state) => state.defaultCompany?._id);
  const setAvailableProducts = useCompanyStore((state) => state.setAvailableProducts);

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["products", companyId],
    queryFn: async () => {
      if (!companyId) return [];
      const products = await getMyProducts(companyId);
      setAvailableProducts(
        products.filter((product: any) => product.is_active && product.quantity > 0)
      )
      return products;
    },
    staleTime: 1000 * 60 * 60,
    enabled: !!companyId,
    refetchOnWindowFocus: false,
  });

  return {
    data,
    isLoading,
    refetch,
    isFetching,
  };
};
