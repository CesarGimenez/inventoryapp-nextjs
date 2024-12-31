'use client'

import QueryApi from "@/api/useQueryApi";


export const getAnalyticsDashboard = (id: string) => QueryApi({
    type: "GET",
    url: "v1/basic-reports/dashboard-analytics",
    id,
});