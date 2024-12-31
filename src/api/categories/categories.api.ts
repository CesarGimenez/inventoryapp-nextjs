'use client'

import QueryApi from "../useQueryApi";

export const getMyCategories = (id: string) => QueryApi({
    type: "GET",
    url: "v1/categories/company",
    id,
});

export const createCategoryApi = (data: any) => QueryApi({
    type: "POST",
    url: "v1/categories",
    data,
});