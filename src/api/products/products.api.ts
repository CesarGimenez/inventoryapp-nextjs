'use client'

const BASE_API = process.env.NEXT_PUBLIC_API_URL;

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

export const getProductsReport = (id: string) => {
  fetch(`${BASE_API}/v1/basic-reports/products/${id}`)
    .then((res) => res.blob())
    .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const newWindow = window.open(url, "_blank");
        newWindow?.focus();
        newWindow?.print();
      })
    .catch((error) => {
      console.error("Error al obtener el reporte de productos:", error);
    });
};