'use client'

const BASE_API = process.env.NEXT_PUBLIC_API_URL;

import QueryApi from "@/api/useQueryApi";
import { usePayment } from "./usePayment";

export const getMyPayments = (id: string) => QueryApi({
    type: "GET",
    url: "v1/payments/company",
    id,
});

export const setPendingPayment = (id: string, data = { status: 'Pendiente'}) => QueryApi({
    type: 'PATCH',
    url: 'v1/payments',
    data,
    id,
})

export const setCompletePayment = (id: string, data = { status: 'Pagado'}) => QueryApi({
    type: 'PATCH',
    url: 'v1/payments',
    data,
    id,
})

export const downloadInvoice = () => {
    fetch(`${BASE_API}/v1/basic-reports`)
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "invoice.pdf";
        a.click();
      });
  }
  
export const printInvoice = () => {
    fetch(`${BASE_API}/v1/basic-reports`)
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        window.open(url, "_blank");
      });
  }