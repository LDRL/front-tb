import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { PaginationModel, pageSize } from '@/utils';
import { TallaAdapter, TallaListAdapter } from '../adapter';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TallaList, ApiResponseTalla, Talla, ApiTalla, CreateOrUpdateTallaResponse } from '../models';
import axiosClient, { getErrorMessage } from '@/utils/axiosClient';

const apiUrl = import.meta.env.VITE_API_URL;

export const useFetchTallas = (page: number = 1, search: string) => {
  return useQuery<ApiResponseTalla, Error>({
    queryKey: ['tallas', page, search],
    queryFn: async () => {
      const response = await axiosClient.get<ApiResponseTalla>(
        `${apiUrl}tallas/?page=${page}&search=${search}`
      );
      return response.data;
    },
  });
};

export const useTalla = (initialPage: number = 1) => {
  const search = useSelector((state: any) => state.talla.search);

  const [tallas, setTallas] = useState<TallaList>([]);
  const [totalTalla, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(initialPage);

  const [paginationModel, setPaginationModel] = useState<PaginationModel>({
    page: initialPage - 1,
    pageSize: pageSize,
  });

  const { data, error, isLoading } = useFetchTallas(page, search);

  useEffect(() => {
    if (data) {
      const adaptedTallas = data ? TallaListAdapter(data.data) : [];
      setTallas(adaptedTallas || []);
      setTotal(data?.meta?.total || 0);
    }
  }, [data]);

  const handlePaginationModelChange = (newPaginationModel: PaginationModel) => {
    setPaginationModel(newPaginationModel);
    const newPage = newPaginationModel.page + 1;
    setPage(newPage);
  };

  return {
    tallas,
    totalTalla,
    isLoading,
    error,
    paginationModel,
    handlePaginationModelChange,
  };
};

export const useGetTalla = (tallaId: string) => {
  return useQuery<Talla, Error>({
    queryKey: ['talla', tallaId],
    queryFn: async () => {
      const response = await axiosClient.get<{ data: ApiTalla }>(`${apiUrl}tallas/${tallaId}`);

      if (response.status !== 200) {
        throw new Error('Error al cargar la talla');
      }

      return TallaAdapter(response.data.data);
    },
  });
};

export const useCreateTalla = () => {
  const queryClient = useQueryClient();

  return useMutation<Talla, unknown, Talla>({
    mutationFn: async (newTalla) => {
      const talla = {
        nombre: newTalla.name,
        tipo: newTalla.type,
        orden: Number(newTalla.order),
      };

      const response = await axiosClient.post<CreateOrUpdateTallaResponse>(
        `${apiUrl}tallas`,
        talla
      );

      if (response.status !== 201 && response.status !== 200) {
        throw new Error('Error al crear la talla');
      }

      return TallaAdapter(response.data.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tallas'] });
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      throw new Error(message);
    },
  });
};

export const useUpdateTalla = () => {
  const queryClient = useQueryClient();

  return useMutation<Talla, unknown, Talla>({
    mutationFn: async (updatedTalla) => {
      const talla = {
        nombre: updatedTalla.name,
        tipo: updatedTalla.type,
        orden: Number(updatedTalla.order),
      };

      const response = await axiosClient.put<CreateOrUpdateTallaResponse>(
        `${apiUrl}tallas/${updatedTalla.id}`,
        talla
      );

      if (response.status !== 200) {
        throw new Error('Error al actualizar la talla');
      }

      return TallaAdapter(response.data.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tallas'] });
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      throw new Error(message);
    },
  });
};

export const useActivateTalla = () => {
  const queryClient = useQueryClient();

  return useMutation<Talla, unknown, Talla>({
    mutationFn: async (talla) => {
      const tallaToActivate = {
        nombre: talla.name,
        tipo: talla.type,
        orden: Number(talla.order),
        estado: true,
      };

      const response = await axiosClient.put<CreateOrUpdateTallaResponse>(
        `${apiUrl}tallas/${talla.id}`,
        tallaToActivate
      );

      if (response.status !== 200) {
        throw new Error('Error al activar la talla');
      }

      return TallaAdapter(response.data.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tallas'] });
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      throw new Error(message);
    },
  });
};

export const useDeleteTalla = () => {
  const queryClient = useQueryClient();

  return useMutation<TallaList, unknown, number>({
    mutationFn: async (tallaId) => {
      const response = await axiosClient.delete<CreateOrUpdateTallaResponse>(
        `${apiUrl}tallas/${tallaId}`
      );

      if (response.status !== 200) {
        throw new Error('Error al eliminar la talla');
      }

      return TallaListAdapter([]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tallas'] });
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      throw new Error(message);
    },
  });
};
