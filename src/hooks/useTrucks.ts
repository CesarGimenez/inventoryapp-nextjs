import { getMyTrucks } from "@/api/trucks/trucks.api";
import { useCompanyStore } from "@/store";
import { useQuery } from "@tanstack/react-query";

export const useTrucks = () => {
  const companyId = useCompanyStore((state) => state.defaultCompany?._id);
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["trucks", companyId],
    queryFn: () => getMyTrucks(companyId),
    staleTime: 1000 * 60 * 60,
    enabled: !!companyId,
    refetchOnWindowFocus: false,
  });

  return {
    data,
    isLoading,
    refetch,
    isFetching
  };
};
