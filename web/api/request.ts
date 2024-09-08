import { ErrorResponse } from '../types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export const request = async ({
  path,
  method = 'GET',
  body,
  token,
}: {
  path: string;
  method?: RequestMethod;
  body?: unknown;
  token?: string | null;
}) => {
  const headers = new Headers();

  if (body && !(body instanceof FormData)) {
    headers.append('Content-Type', 'application/json');
  }
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  const requestBody =
    body && !(body instanceof FormData)
      ? JSON.stringify(body)
      : (body as FormData);

  const response = await fetch(`${BASE_URL}${path}`, {
    headers,
    method,
    body: requestBody || undefined,
  });

  if (!response.ok) {
    const error = (await response.json()) as ErrorResponse;
    throw error.error;
  }

  return response.json();
};
