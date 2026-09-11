import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { PaginationModel, pageSize } from '@/utils';
import { UnitAdapter, UnitListAdapter } from '../adapter';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UnitList, ApiResponseUnit, Unit, ApiUnit, CreateOrUpdateUnitResponse } from '../models';
import axiosClient, { getErrorMessage } from '@/utils/axiosClient';

const apiUrl = import.meta.env.VITE_API_URL;

export const useFetchUnits = (page: number = 1, search: string) => {
    return useQuery<ApiResponseUnit, Error>({
        queryKey: ['units', page, search],
        queryFn: async () => {
            const response = await axiosClient.get<ApiResponseUnit>(`${apiUrl}unidades/?page=${page}&search=${search}`);
            return response.data;
        }
    });
};

//Hook for list units and search for name
export const useUnit = (initialPage: number = 1) => {
    const search = useSelector((state: any) => state.unit.search);

    const [units, setUnits] = useState<UnitList>([]);
    const [totalUnit, setTotal] = useState<number>(0);
    const [page, setPage] = useState<number>(initialPage);

    const [paginationModel, setPaginationModel] = useState<PaginationModel>({
        page: initialPage - 1,
        pageSize: pageSize,
    });

    const { data, error, isLoading } = useFetchUnits(page, search);

    useEffect(() => {
        if (data) {
            const adaptedUnits = data ? UnitListAdapter(data.data) : [];
            setUnits(adaptedUnits || []);
            setTotal(data?.meta.total || 0);
        }
    }, [data]);

    const handlePaginationModelChange = (newPaginationModel: PaginationModel) => {
        setPaginationModel(newPaginationModel);
        const newPage = newPaginationModel.page + 1;
        setPage(newPage);
    };

    return {
        units,
        totalUnit,
        isLoading,
        error,
        paginationModel,
        handlePaginationModelChange,
    };
};

// Hook for get an Unit for id
export const useGetUnit = (unitId: string) => {
    return useQuery<Unit, Error>({
        queryKey: ['unit', unitId],
        queryFn: async () => {
            const response = await axiosClient.get<{ data: ApiUnit }>(`${apiUrl}unidades/${unitId}`);

            if (response.status !== 200) {
                throw new Error('Error al cargar la unidad de medida');
            }

            return UnitAdapter(response.data.data);
        },
    });
};

// Hook for create new Unit
export const useCreateUnit = () => {
    const queryClient = useQueryClient();

    return useMutation<Unit, unknown, Unit>({
        mutationFn: async (newUnit) => {
            const unit = {
                nombre: newUnit.name,
                abreviatura: newUnit.abbreviation,
            };

            const response = await axiosClient.post<CreateOrUpdateUnitResponse>(
                `${apiUrl}unidades/`,
                unit
            );

            if (response.status !== 201) {
                throw new Error('Error al crear la unidad de medida');
            }

            return UnitAdapter(response.data.data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['units'] });
        },
        onError: (error) => {
            const message = getErrorMessage(error);
            throw new Error(message);
        },
    });
};

// Hook para actualizar una unidad existente
export const useUpdateUnit = () => {
    const queryClient = useQueryClient();

    return useMutation<Unit, unknown, Unit>({
        mutationFn: async (updatedUnit) => {
            const unit = {
                nombre: updatedUnit.name,
                abreviatura: updatedUnit.abbreviation,
            };

            const response = await axiosClient.put<CreateOrUpdateUnitResponse>(`${apiUrl}unidades/${updatedUnit.id}`, unit);

            if (response.status !== 200) {
                throw new Error('Error al actualizar la unidad de medida');
            }

            return UnitAdapter(response.data.data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['units'] });
        },
        onError: (error) => {
            const message = getErrorMessage(error);
            throw new Error(message);
        },
    });
};

// Hook para eliminar una unidad
export const useDeleteUnit = () => {
    const queryClient = useQueryClient();

    return useMutation<UnitList, unknown, number>({
        mutationFn: async (unitId) => {
            const response = await axiosClient.delete<CreateOrUpdateUnitResponse>(`${apiUrl}unidades/${unitId}`);

            if (response.status !== 200) {
                throw new Error('Error al eliminar la unidad de medida');
            }

            return UnitListAdapter([]);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['units'] });
        },
        onError: (error) => {
            const message = getErrorMessage(error);
            throw new Error(message);
        },
    });
}