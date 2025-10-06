const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';

interface FetchWrapperOptions {
  url: string;
  method: string;
  data?: any;
  headers?: HeadersInit;
}

export function fetchWrapper({ url, method, data, headers }: FetchWrapperOptions): Promise<Response> {
  const fullUrl = `${BASE_URL}${url}`;
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  return fetch(fullUrl, options);
}