import { getAnalyticsDashboard } from "@/app/dashboard/home/api";
import { useCompanyStore } from "@/store";
import { useQuery } from "@tanstack/react-query";

export const useAnalytics = () => {
  const { defaultCompany } = useCompanyStore((state) => state);
  const companyId = defaultCompany?._id;

  const { data, isFetching, isLoading } = useQuery({
    queryKey: ["analytics", companyId],
    queryFn: () => getAnalyticsDashboard(companyId),
    enabled: !!companyId,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 60,
  });

  return {
    data,
    isLoading,
    isFetching,
  };
};
