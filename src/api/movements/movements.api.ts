import QueryApi from "../useQueryApi";

export const getMyMovements = (id: string) => QueryApi({
    type: "GET",
    url: "v1/movements/company",
    id,
});

export const createMovement = (data: any) => QueryApi({
    type: "POST",
    url: "v1/movements",
    data,
});