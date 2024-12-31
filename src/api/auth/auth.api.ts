import QueryApi from "../useQueryApi";

export const LoginApi = (data: any) => QueryApi({
    type: "POST",
    url: "v1/auth/login",
    data
});