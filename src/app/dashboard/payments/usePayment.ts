'use client'
import { useQuery } from "@tanstack/react-query";
import { getMyPayments } from "./api";

export const usePayment = (companyId: string) => {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ["payments", companyId],
        queryFn: () => getMyPayments(companyId),
        enabled: !!companyId,
    });

    return {
        data,
        isLoading, 
        refetch
    }
}