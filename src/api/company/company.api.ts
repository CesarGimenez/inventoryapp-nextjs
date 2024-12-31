import QueryApi from "../useQueryApi";

export const createCompanyApi = (data: any) => QueryApi({
    type: "POST",
    url: "v1/companies",
    data
});