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
    if (error && typeof error === "object") {
            const axiosError = error as AxiosError<any>;

            console.log(axiosError);

            // Error enviado por nodeJs
            if (axiosError.response?.data?.error) {
                if (Array.isArray(axiosError.response.data.error)) {
                    // errores de validación 422
                    return axiosError.response.data.error
                    .map((err: any) => err.msg)
                    .join(", ");
                }
                return axiosError.response.data.error;
            }

            if (axiosError.response?.data?.message) {
                return axiosError.response.data.message;
            }
    }

    return "Ocurrió un error inesperado";
};