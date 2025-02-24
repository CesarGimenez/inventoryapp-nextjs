import QueryApi from "../useQueryApi";

export const createCompanyApi = (data: any) => QueryApi({
    type: "POST",
    url: "v1/companies",
    data
});

// export const getMyCompanies = (id: string) => QueryApi({
//     type: "GET",
//     url: "v1/companies",
//     id
// });