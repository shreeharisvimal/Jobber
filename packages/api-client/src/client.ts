import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig } from "axios";

export interface RequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean;
}

export interface ApiClientError {
  status: number;
  message: string;
  detail: string | null;
}

function createApiClient(baseURL = "/api/v1"): AxiosInstance {
  const client = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
    timeout: 30000,
  });

  client.interceptors.request.use((config) => {
    if (!config.skipAuth) {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ error: ApiClientError }>) => {
      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    },
  );

  return client;
}

export const apiClient = createApiClient();
