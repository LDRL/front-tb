import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { PaginationModel, pageSize } from '@/utils';
import { PublicoAdapter, PublicoListAdapter } from '../adapter';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PublicoList, ApiResponsePublico, Publico, ApiPublico, CreateOrUpdatePublicoResponse } from '../models';
import axiosClient, { getErrorMessage } from '@/utils/axiosClient';

const apiUrl = import.meta.env.VITE_API_URL;

export const useFetchPublicos = (page: number = 1, search: string) => {
  return useQuery<ApiResponsePublico, Error>({
    queryKey: ['publicos', page, search],
    queryFn: async () => {
      const response = await axiosClient.get<ApiResponsePublico>(
        `${apiUrl}publicos/?page=${page}&search=${search}`
      );
      return response.data;
    },
  });
};

export const usePublico = (initialPage: number = 1) => {
  const search = useSelector((state: any) => state.publico.search);

  const [publicos, setPublicos] = useState<PublicoList>([]);
  const [totalPublico, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(initialPage);

  const [paginationModel, setPaginationModel] = useState<PaginationModel>({
    page: initialPage - 1,
    pageSize: pageSize,
  });

  const { data, error, isLoading } = useFetchPublicos(page, search);

  useEffect(() => {
    if (data) {
      const adaptedPublicos = data ? PublicoListAdapter(data.data) : [];
      setPublicos(adaptedPublicos || []);
      setTotal(data?.meta?.total || 0);
    }
  }, [data]);

  const handlePaginationModelChange = (newPaginationModel: PaginationModel) => {
    setPaginationModel(newPaginationModel);
    const newPage = newPaginationModel.page + 1;
    setPage(newPage);
  };

  return {
    publicos,
    totalPublico,
    isLoading,
    error,
    paginationModel,
    handlePaginationModelChange,
  };
};

export const useGetPublico = (publicoId: string) => {
  return useQuery<Publico, Error>({
    queryKey: ['publico', publicoId],
    queryFn: async () => {
      const response = await axiosClient.get<{ data: ApiPublico }>(`${apiUrl}publicos/${publicoId}`);

      if (response.status !== 200) {
        throw new Error('Error al cargar el público');
      }

      return PublicoAdapter(response.data.data);
    },
  });
};

export const useCreatePublico = () => {
  const queryClient = useQueryClient();

  return useMutation<Publico, unknown, Publico>({
    mutationFn: async (newPublico) => {
      const publico = {
        nombre: newPublico.name,
      };

      const response = await axiosClient.post<CreateOrUpdatePublicoResponse>(
        `${apiUrl}publicos`,
        publico
      );

      if (response.status !== 201 && response.status !== 200) {
        throw new Error('Error al crear el público');
      }

      return PublicoAdapter(response.data.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicos'] });
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      throw new Error(message);
    },
  });
};

export const useUpdatePublico = () => {
  const queryClient = useQueryClient();

  return useMutation<Publico, unknown, Publico>({
    mutationFn: async (updatedPublico) => {
      const publico = {
        nombre: updatedPublico.name,
      };

      const response = await axiosClient.put<CreateOrUpdatePublicoResponse>(
        `${apiUrl}publicos/${updatedPublico.id}`,
        publico
      );

      if (response.status !== 200) {
        throw new Error('Error al actualizar el público');
      }

      return PublicoAdapter(response.data.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicos'] });
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      throw new Error(message);
    },
  });
};

export const useActivatePublico = () => {
  const queryClient = useQueryClient();

  return useMutation<Publico, unknown, Publico>({
    mutationFn: async (publico) => {
      const publicoToActivate = {
        nombre: publico.name,
        estado: true,
      };

      const response = await axiosClient.put<CreateOrUpdatePublicoResponse>(
        `${apiUrl}publicos/${publico.id}`,
        publicoToActivate
      );

      if (response.status !== 200) {
        throw new Error('Error al activar el público');
      }

      return PublicoAdapter(response.data.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicos'] });
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      throw new Error(message);
    },
  });
};

export const useDeletePublico = () => {
  const queryClient = useQueryClient();

  return useMutation<PublicoList, unknown, number>({
    mutationFn: async (publicoId) => {
      const response = await axiosClient.delete<CreateOrUpdatePublicoResponse>(
        `${apiUrl}publicos/${publicoId}`
      );

      if (response.status !== 200) {
        throw new Error('Error al eliminar el público');
      }

      return PublicoListAdapter([]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicos'] });
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      throw new Error(message);
    },
  });
};
