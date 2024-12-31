'use client'

import QueryApi from "../useQueryApi";

export const getMyTrucks = (id: string) => QueryApi({
    type: "GET",
    url: "v1/trucks/company",
    id,
});

export const createTruck = (data: any) => QueryApi({
    type: "POST",
    url: "v1/trucks",
    data,
});