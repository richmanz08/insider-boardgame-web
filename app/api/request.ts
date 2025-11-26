type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface RequestOptions<T> {
  method?: HttpMethod;
  body?: T | FormData;
  token?: string;
  isFormData?: boolean; // 👈 new flag
}

export async function apiReq<TRequest, TResponse>(
  routeURL: string,
  options: RequestOptions<TRequest> = {}
): Promise<TResponse> {
  const { method = "GET", body, token, isFormData = false } = options;
  const url = `${process.env.NEXT_PUBLIC_BASE_URL_API_SALE}${routeURL}`;

  const headers: HeadersInit = {};

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const fetchOptions: RequestInit = {
    method,
    headers,
  };

  if (method !== "GET" && body) {
    const requestBody = isFormData ? (body as FormData) : JSON.stringify(body);
    fetchOptions.body = requestBody;
  }

  const response = await fetch(url, fetchOptions);

  if (response.status >= 400) {
    throw new Error(`HTTP error! status: ${response.status}`, {
      cause: await response.text(),
    });
  }

  // Check content-type header to determine how to parse response
  const contentType = response.headers.get("content-type");
  console.log("API Response Content-Type:", contentType);

  try {
    // If content-type is JSON, parse as JSON
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }

    // Try to parse as JSON anyway (some APIs don't set correct content-type)
    const text = await response.text();
    return { data: text } as TResponse;
  } catch (error) {
    console.error("Error parsing response:", error);
    throw new Error("Failed to parse API response", { cause: error });
  }
}
