'use client'

const BASE_API = process.env.NEXT_PUBLIC_API_URL;

import QueryApi from "@/api/useQueryApi";

interface Payment {
  _id: string;
  status: string;
  total: number;
  payment_method: string;
  createdAt: string;
  updatedAt: string;
  payment_date?: string;
  client: Client;
  seller: Seller;
  payment_details: PaymentDetail[]
  payed?: number;
  pending?: number;
  partial_payments?: PartialPayment[];
}

interface Client {
  name: string;
  phone: string;
  avatar?: string;
  address: string;
}

interface Seller {
  name: string;
  email: string;
  avatar?: string;
}

interface Product {
  name: string;
  quantity: number;
  price: number;
  is_active?: boolean;
}

interface PaymentDetail {
  product: Product;
  quantity: number;
  price: number;
}

interface PartialPayment {
  amount: number;
  createdAt: string;
}

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

export const addPartialPayment = (id: string, data: { amount: number}) => QueryApi({
  type: 'PATCH',
  url: 'v1/payments/partial',
  data,
  id,
})

export const getPaymentDetails = (id: string): Promise<Payment> => QueryApi({
    type: "GET",
    url: "v1/payments",
    id,
})

export const downloadInvoice = () => {
    fetch(`${BASE_API}/v1/basic-reports`)
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `invoice-${Date.now()}.pdf`;
        a.click();
      });
  }
  
export const printInvoice = () => {
    fetch(`${BASE_API}/v1/basic-reports`)
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const newWindow = window.open(url, "_blank");
        newWindow?.focus();
        newWindow?.print();
      });
  }