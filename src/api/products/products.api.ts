'use client'

import QueryApi from "../useQueryApi";

export const getMyProducts = (id: string) => QueryApi({
    type: "GET",
    url: "v1/products/company",
    id,
});

export const createProduct = (data: any) => QueryApi({
    type: "POST",
    url: "v1/products",
    data,
});