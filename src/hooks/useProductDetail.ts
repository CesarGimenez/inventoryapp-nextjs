import { getProductDetails } from "@/api/products/products.api";
import { useQuery } from "@tanstack/react-query";

export const useProductDetail = (id: string) => {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!id) return null;
      return await getProductDetails(id);
    },
    staleTime: 1000 * 60 * 60,
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

  return {
    data,
    isLoading,
    refetch,
    isFetching,
  };
};
