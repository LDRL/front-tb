import axios, { AxiosError } from 'axios';
import { userKey } from '@/redux/user';

const axiosClient = axios.create({
  baseURL: '/api', // tu base URL del backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token JWT
axiosClient.interceptors.request.use((config) => {
  const auth = localStorage.getItem(userKey);
  if (auth) {
    const { token } = JSON.parse(auth);
    if (config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default axiosClient;


export const getErrorMessage = (error: unknown): string => {
  // 1. Axios error (backend)
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as AxiosError<any>;

    const data = axiosError.response?.data;

    if (data?.error) {
      if (Array.isArray(data.error)) {
        return data.error.map((err: any) => err.msg).join(", ");
      }
      return data.error;
    }

    if (data?.message) {
      return data.message;
    }
  }

  // 2. Error normal de JS (hook / frontend)
  if (error instanceof Error) {
    return error.message;
  }

  // 3. fallback
  return "Ocurrió un error inesperado";
};