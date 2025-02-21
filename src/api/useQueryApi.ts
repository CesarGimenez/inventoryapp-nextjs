import { useAuthStore } from "@/store";

const BASE_API = process.env.NEXT_PUBLIC_API_URL;

interface Props {
  type?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  url: string;
  data?: unknown;
  id?: string | null;
}

const QueryApi = async ({ type = "GET", url = "", data = null, id = null }: Props) => {
  const token = useAuthStore.getState().token;
  const URL = id ? `${BASE_API}/${url}/${id}` : `${BASE_API}/${url}`;

  const HEADERS = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const PARAMS: RequestInit = {
    method: type,
    headers: HEADERS,
  };

  if (type === "POST" || type === "PUT" || type === "PATCH") {
    PARAMS.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(URL, PARAMS);

    if(!response.ok) {
      const failedResult = await response.json();
      throw new Error(failedResult.message);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    throw new Error(error as string);
  }
};

export default QueryApi;
