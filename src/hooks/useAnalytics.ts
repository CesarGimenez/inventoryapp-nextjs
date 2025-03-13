import { getAnalyticsDashboard } from "@/app/dashboard/home/api";
import { useAuthStore, useCompanyStore } from "@/store";
import { useQuery } from "@tanstack/react-query";

export const useAnalytics = (date: string) => {
  const { defaultCompany } = useCompanyStore((state) => state);
  const type = useAuthStore((state) => state.user?.type);
  const companyId = defaultCompany?._id;

  const enableTypes = ["PROPIETARIO", "ADMINISTRADOR"];

  const body = {
    date,
  }

  const { data, isFetching, isLoading, refetch } = useQuery({
    queryKey: ["analytics", companyId],
    queryFn: () => getAnalyticsDashboard(companyId, body),
    enabled: !!companyId && !!type && enableTypes.includes(type),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 60,
  });

  return {
    data,
    isLoading,
    isFetching,
    refetch
  };
};
