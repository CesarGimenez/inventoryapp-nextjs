'use client'
import { useMutation, useQuery } from "@tanstack/react-query";
import { getMyPayments, getPaymentDetails, setCompletePayment, setPendingPayment } from './api';
import { useToast } from "@/components/ui/use-toast";
import { useCompanyStore } from '../../../store/companies/useCompanyStore';

export const usePayment = (id?: string) => {
    const { toast } = useToast();
    const idCompany = useCompanyStore((state) => state.defaultCompany?._id);

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["payments", idCompany],
        queryFn: () => getMyPayments(idCompany),
        refetchOnWindowFocus: false,
        enabled: !!idCompany,
        staleTime: 1000 * 60 * 60
    });

    const { data: dataDetail, isLoading: isLoadingDetailm, refetch: refetchDetail } = useQuery({
        queryKey: ["paymentDetail", id],
        queryFn: () => getPaymentDetails(id as string),
        enabled: !!id,
        staleTime: 1000 * 60 * 60
    });

    const { mutate: setPending } = useMutation({
        mutationFn: (id: string) => setPendingPayment(id),
        onSuccess: () => {
            toast({
                variant: "success",
                title: "Estatus de pago actualizado",
                description: "El estatus del pago se ha actualizado correctamente",
            });
            refetch();
        },
        onError: () => {
            toast({
              variant: "destructive",
              title: "Error",
              description: "Ha ocurrido un error al crear la categoria",
            });
          },
      });

      const { mutate: setComplete } = useMutation({
        mutationFn: (id: string) => setCompletePayment(id),
        onSuccess: () => {
            toast({
                variant: "success",
                title: "Estatus de pago actualizado",
                description: "El estatus del pago se ha actualizado correctamente",
            });
            refetch();
        },
        onError: () => {
            toast({
              variant: "destructive",
              title: "Error",
              description: "Ha ocurrido un error al crear la categoria",
            });
          },
      });

    return {
        data,
        isLoading, 
        refetch,
        setPending,
        setComplete,
        dataDetail,
        isLoadingDetailm,
        refetchDetail
    }
}