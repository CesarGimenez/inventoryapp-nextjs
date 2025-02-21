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

export const getProductDetails = (id: string) => QueryApi({
    type: "GET",
    url: "v1/products",
    id,
})

export const updateProduct = (id: string, data: any) => QueryApi({
    type: "PATCH",
    url: "v1/products",
    data,
    id,
})