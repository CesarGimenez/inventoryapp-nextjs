import { getMyMovements } from "@/api/movements/movements.api";
import { useCompanyStore } from "@/store";
import { useQuery } from "@tanstack/react-query";

export const useMovements = () => {
    const companyId = useCompanyStore((state) => state.defaultCompany?._id);
    
    const { data, isLoading, refetch, isFetching } = useQuery({
        queryKey: ["movements", companyId],
        queryFn: () => getMyMovements(companyId),
        staleTime: 1000 * 60 * 60,
        enabled: !!companyId,
        refetchOnWindowFocus: false
    });

    return {
        data,
        isLoading,
        refetch,
        isFetching
    };
};