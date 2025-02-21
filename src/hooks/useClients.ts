import { getMyClients } from "@/app/dashboard/clients/api";
import { useCompanyStore } from "@/store";
import { useQuery } from "@tanstack/react-query";

export const useClients = () => {
    const companyId = useCompanyStore((state) => state.defaultCompany?._id);

    const { data, isLoading, refetch, isFetching } = useQuery({
        queryKey: ["clients", companyId],
        queryFn: () => getMyClients(companyId),
        staleTime: 1000 * 60 * 60,
        enabled: !!companyId,
        refetchOnWindowFocus: false
      });

    return {
        data,
        isLoading,
        refetch,
        isFetching
    }
}