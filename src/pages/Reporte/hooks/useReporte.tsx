import { useQuery } from '@tanstack/react-query';
import axiosClient from '@/utils/axiosClient';
import { InventarioListAdapter } from '../adapter';
import { ApiResponseReporteInventario } from '../models';

const apiUrl = import.meta.env.VITE_API_URL;

export const useReporteInventario = () => {
    const { data, isLoading, error } = useQuery<ApiResponseReporteInventario, Error>({
        queryKey: ['reporte', 'inventario'],
        queryFn: async () => {
            const response = await axiosClient.get<ApiResponseReporteInventario>(
                `${apiUrl}reportes/inventario`
            );

            if (response.status !== 200) {
                throw new Error('Error al cargar el reporte de inventario');
            }

            return response.data;
        },
    });

    return {
        inventario: data ? InventarioListAdapter(data.data) : [],
        meta: data?.meta ?? null,
        isLoading,
        error,
    };
};