'use client'

import QueryApi from "@/api/useQueryApi";

export const getMyUsers = (id: string) => QueryApi({
    type: "GET",
    url: "v1/users/company",
    id,
});

export const createUser = (data: any) => QueryApi({
    type: "POST",
    url: "v1/users",
    data,
});