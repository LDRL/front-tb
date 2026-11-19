import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { PaginationModel, pageSize } from '@/utils';
import { ColorAdapter, ColorListAdapter } from '../adapter';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ColorList, ApiResponseColor, Color, ApiColor, CreateOrUpdateColorResponse } from '../models';
import axiosClient, { getErrorMessage } from '@/utils/axiosClient';

const apiUrl = import.meta.env.VITE_API_URL;

export const useFetchColors = (page: number = 1, search: string) => {
  return useQuery<ApiResponseColor, Error>({
    queryKey: ['colors', page, search],
    queryFn: async () => {
      const response = await axiosClient.get<ApiResponseColor>(
        `${apiUrl}colores/?page=${page}&search=${search}`
      );
      return response.data;
    },
  });
};

export const useColor = (initialPage: number = 1) => {
  const search = useSelector((state: any) => state.color.search);

  const [colors, setColors] = useState<ColorList>([]);
  const [totalColor, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(initialPage);

  const [paginationModel, setPaginationModel] = useState<PaginationModel>({
    page: initialPage - 1,
    pageSize: pageSize,
  });

  const { data, error, isLoading } = useFetchColors(page, search);

  useEffect(() => {
    if (data) {
      const adaptedColors = data ? ColorListAdapter(data.data) : [];
      setColors(adaptedColors || []);
      setTotal(data?.meta?.total || 0);
    }
  }, [data]);

  const handlePaginationModelChange = (newPaginationModel: PaginationModel) => {
    setPaginationModel(newPaginationModel);
    const newPage = newPaginationModel.page + 1;
    setPage(newPage);
  };

  return {
    colors,
    totalColor,
    isLoading,
    error,
    paginationModel,
    handlePaginationModelChange,
  };
};

export const useGetColor = (colorId: string) => {
  return useQuery<Color, Error>({
    queryKey: ['color', colorId],
    queryFn: async () => {
      const response = await axiosClient.get<{ data: ApiColor }>(`${apiUrl}colores/${colorId}`);

      if (response.status !== 200) {
        throw new Error('Error al cargar el color');
      }

      return ColorAdapter(response.data.data);
    },
  });
};

export const useCreateColor = () => {
  const queryClient = useQueryClient();

  return useMutation<Color, unknown, Color>({
    mutationFn: async (newColor) => {
      const color = {
        nombre: newColor.name,
        hex: newColor.hex,
      };

      const response = await axiosClient.post<CreateOrUpdateColorResponse>(
        `${apiUrl}colores`,
        color
      );

      if (response.status !== 201 && response.status !== 200) {
        throw new Error('Error al crear el color');
      }

      return ColorAdapter(response.data.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colors'] });
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      throw new Error(message);
    },
  });
};

export const useUpdateColor = () => {
  const queryClient = useQueryClient();

  return useMutation<Color, unknown, Color>({
    mutationFn: async (updatedColor) => {
      const color = {
        nombre: updatedColor.name,
        hex: updatedColor.hex,
      };

      const response = await axiosClient.put<CreateOrUpdateColorResponse>(
        `${apiUrl}colores/${updatedColor.id}`,
        color
      );

      if (response.status !== 200) {
        throw new Error('Error al actualizar el color');
      }

      return ColorAdapter(response.data.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colors'] });
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      throw new Error(message);
    },
  });
};

export const useActivateColor = () => {
  const queryClient = useQueryClient();

  return useMutation<Color, unknown, Color>({
    mutationFn: async (color) => {
      const colorToActivate = {
        nombre: color.name,
        hex: color.hex,
        estado: true,
      };

      const response = await axiosClient.put<CreateOrUpdateColorResponse>(
        `${apiUrl}colores/${color.id}`,
        colorToActivate
      );

      if (response.status !== 200) {
        throw new Error('Error al activar el color');
      }

      return ColorAdapter(response.data.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colors'] });
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      throw new Error(message);
    },
  });
};

export const useDeleteColor = () => {
  const queryClient = useQueryClient();

  return useMutation<ColorList, unknown, number>({
    mutationFn: async (colorId) => {
      const response = await axiosClient.delete<CreateOrUpdateColorResponse>(
        `${apiUrl}colores/${colorId}`
      );

      if (response.status !== 200) {
        throw new Error('Error al eliminar el color');
      }

      return ColorListAdapter([]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colors'] });
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      throw new Error(message);
    },
  });
};
