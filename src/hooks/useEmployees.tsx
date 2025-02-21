import { getMyEmployees } from "@/api/employees/employees.api";
import { useAuthStore, useCompanyStore } from "@/store";
import { useQuery } from "@tanstack/react-query";

export const useEmployees = () => {
    const idCompany = useCompanyStore((state) => state.defaultCompany?._id);
    const setWorkers = useCompanyStore((state) => state.setWorkers);
    const user = useAuthStore((state) => state.user);
    const workers = useCompanyStore((state) => state.workers);

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["employees"],
        queryFn: async () => {
            const employees = await getMyEmployees(idCompany);
            if(employees) {
                setWorkers(employees?.map((employee: any) => {
                    return {
                        _id: employee._id,
                        name: employee.name,
                        email: employee.email,
                        type: employee.type
                    }
                }).filter((employee: any) => {
                    if (user?.type === "PROPIETARIO") {
                        return employee.type !== "PROPIETARIO";
                    }
                    if (user?.type === "ADMINISTRADOR") {
                        return employee.type !== "PROPIETARIO" && employee.type !== "ADMINISTRADOR";
                    }
                }));
            }
            return employees;
        },
        staleTime: 1000 * 60 * 60,
        enabled: !!idCompany,
        refetchOnWindowFocus: false
    });

    return {
        data,
        isLoading,
        refetch,
        normalEmployees: workers
    };
};