'use client'

import QueryApi from "@/api/useQueryApi";

export const getMyClients = (id: string) => QueryApi({
    type: "GET",
    url: "v1/clients/company",
    id,
});

export const createClient = (data: any) => QueryApi({
    type: "POST",
    url: "v1/clients",
    data,
});