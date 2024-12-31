'use client'

import QueryApi from "@/api/useQueryApi";

export const createPayment = (data: any) => QueryApi({
    type: "POST",
    url: "v1/payments",
    data,
});