import QueryApi from "../useQueryApi";

export const getMyEmployees = (id: string) => QueryApi({
    type: "GET",
    url: "v1/users/company",
    id,
});