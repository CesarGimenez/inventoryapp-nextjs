'use client'

import QueryApi from "@/api/useQueryApi";

export const getAnalyticsDashboard = (id: string, data: any) => QueryApi({
    type: "POST",
    url: "v1/basic-reports/dashboard-analytics",
    data,
    id,
});