import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient, { getErrorMessage } from '@/utils/axiosClient';
import { PaginationModel, pageSize } from '@/utils';
import {
  AbrirSesionPayload,
  ApiArqueo,
  ApiCaja,
  ApiCajaMovimiento,
  ApiCajaSesion,
  ApiResponse,
  Arqueo,
  Caja,
  CajaMovimiento,
  CajaSesion,
  CerrarSesionPayload,
  CreateCajaPayload,
  MovimientoPayload,
  UpdateCajaPayload,
} from '../models';
import {
  ArqueoAdapter,
  CajaAdapter,
  CajaListAdapter,
  CajaMovimientoAdapter,
  CajaMovimientoListAdapter,
  CajaSesionAdapter,
  CajaSesionListAdapter,
} from '../adapter';

const apiUrl = import.meta.env.VITE_API_URL;
const base = `${apiUrl}cajas`;

const getMetaTotal = (meta?: { total?: number } | null) => meta?.total ?? 0;

// ─── Cajas catálogo ───

export const useFetchCajas = (page: number = 1, search: string = '') => {
  return useQuery<ApiResponse<ApiCaja[]>, Error>({
    queryKey: ['cajas', page, search],
    queryFn: async () => {
      const response = await axiosClient.get<ApiResponse<ApiCaja[]>>(`${base}/`, {
        params: { page, limit: pageSize, search },
      });
      return response.data;
    },
  });
};

export const useCaja = (initialPage: number = 1) => {
  const search = useSelector((state: any) => state.caja.search);

  const [cajas, setCajas] = useState<Caja[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(initialPage);
  const [paginationModel, setPaginationModel] = useState<PaginationModel>({
    page: initialPage - 1,
    pageSize,
  });

  const { data, error, isLoading } = useFetchCajas(page, search);

  useEffect(() => {
    if (data) {
      setCajas(CajaListAdapter(data.data || []));
      setTotal(getMetaTotal(data.meta));
    }
  }, [data]);

  const handlePaginationModelChange = (newPaginationModel: PaginationModel) => {
    setPaginationModel(newPaginationModel);
    setPage(newPaginationModel.page + 1);
  };

  return {
    cajas,
    total,
    isLoading,
    error,
    paginationModel,
    handlePaginationModelChange,
  };
};

export const useGetCaja = (id?: number | string) => {
  return useQuery<Caja, Error>({
    queryKey: ['caja', id],
    enabled: !!id,
    queryFn: async () => {
      const response = await axiosClient.get<ApiResponse<ApiCaja>>(`${base}/${id}/`);
      return CajaAdapter(response.data.data);
    },
  });
};

export const useCreateCaja = () => {
  const queryClient = useQueryClient();
  return useMutation<Caja, Error, CreateCajaPayload>({
    mutationFn: async (payload) => {
      const response = await axiosClient.post<ApiResponse<ApiCaja>>(`${base}/`, payload);
      return CajaAdapter(response.data.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cajas'] });
    },
    onError: (error) => {
      throw new Error(getErrorMessage(error));
    },
  });
};

export const useUpdateCaja = () => {
  const queryClient = useQueryClient();
  return useMutation<Caja, Error, { id: number; payload: UpdateCajaPayload }>({
    mutationFn: async ({ id, payload }) => {
      const response = await axiosClient.put<ApiResponse<ApiCaja>>(`${base}/${id}/`, payload);
      return CajaAdapter(response.data.data);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cajas'] });
      queryClient.invalidateQueries({ queryKey: ['caja', variables.id] });
    },
    onError: (error) => {
      throw new Error(getErrorMessage(error));
    },
  });
};

export const useDeleteCaja = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await axiosClient.delete(`${base}/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cajas'] });
    },
    onError: (error) => {
      throw new Error(getErrorMessage(error));
    },
  });
};

// ─── Sesiones ───

export const useSesionActual = (idcaja?: number) => {
  return useQuery<CajaSesion | null, Error>({
    queryKey: ['caja-sesion-actual', idcaja ?? 'me'],
    queryFn: async () => {
      try {
        const response = await axiosClient.get<ApiResponse<ApiCajaSesion>>(`${base}/sesion-actual`, {
          params: idcaja ? { idcaja } : undefined,
        });
        return CajaSesionAdapter(response.data.data);
      } catch (error: any) {
        const status = error?.response?.status;
        if (status === 404) return null;
        throw error;
      }
    },
    retry: false,
  });
};

export const useSesiones = (params: {
  page?: number;
  limit?: number;
  idcaja?: number;
  estado?: 'ABIERTA' | 'CERRADA';
  desde?: string;
  hasta?: string;
}) => {
  return useQuery<{ data: CajaSesion[]; meta: any }, Error>({
    queryKey: ['caja-sesiones', params],
    queryFn: async () => {
      const response = await axiosClient.get<ApiResponse<ApiCajaSesion[]>>(`${base}/sesiones`, { params });
      return {
        data: CajaSesionListAdapter(response.data.data || []),
        meta: response.data.meta,
      };
    },
  });
};

export const useGetSesion = (id?: number | string) => {
  return useQuery<CajaSesion, Error>({
    queryKey: ['caja-sesion', id],
    enabled: !!id,
    queryFn: async () => {
      const response = await axiosClient.get<ApiResponse<ApiCajaSesion>>(`${base}/sesiones/${id}/`);
      return CajaSesionAdapter(response.data.data);
    },
  });
};

export const useArqueo = (id?: number | string, enabled = true) => {
  return useQuery<Arqueo, Error>({
    queryKey: ['caja-arqueo', id],
    enabled: !!id && enabled,
    queryFn: async () => {
      const response = await axiosClient.get<ApiResponse<ApiArqueo>>(`${base}/sesiones/${id}/arqueo`);
      return ArqueoAdapter(response.data.data);
    },
  });
};

export const useAbrirCaja = () => {
  const queryClient = useQueryClient();
  return useMutation<CajaSesion, Error, { idcaja: number; payload: AbrirSesionPayload }>({
    mutationFn: async ({ idcaja, payload }) => {
      const response = await axiosClient.post<ApiResponse<ApiCajaSesion>>(`${base}/${idcaja}/abrir`, payload);
      return CajaSesionAdapter(response.data.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['caja-sesion-actual'] });
      queryClient.invalidateQueries({ queryKey: ['caja-sesiones'] });
      queryClient.invalidateQueries({ queryKey: ['cajas'] });
    },
    onError: (error) => {
      throw new Error(getErrorMessage(error));
    },
  });
};

export const useCerrarCaja = () => {
  const queryClient = useQueryClient();
  return useMutation<CajaSesion, Error, { idsesion: number; payload: CerrarSesionPayload }>({
    mutationFn: async ({ idsesion, payload }) => {
      const response = await axiosClient.post<ApiResponse<ApiCajaSesion>>(`${base}/sesiones/${idsesion}/cerrar`, payload);
      return CajaSesionAdapter(response.data.data);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['caja-sesion-actual'] });
      queryClient.invalidateQueries({ queryKey: ['caja-sesiones'] });
      queryClient.invalidateQueries({ queryKey: ['caja-sesion', variables.idsesion] });
      queryClient.invalidateQueries({ queryKey: ['caja-arqueo', variables.idsesion] });
      queryClient.invalidateQueries({ queryKey: ['caja-movimientos', variables.idsesion] });
    },
    onError: (error) => {
      throw new Error(getErrorMessage(error));
    },
  });
};

// ─── Movimientos ───

export const useMovimientos = (idsesion?: number | string, tipo?: 'INGRESO' | 'EGRESO') => {
  return useQuery<CajaMovimiento[], Error>({
    queryKey: ['caja-movimientos', idsesion, tipo],
    enabled: !!idsesion,
    queryFn: async () => {
      const response = await axiosClient.get<ApiResponse<ApiCajaMovimiento[]>>(
        `${base}/sesiones/${idsesion}/movimientos`,
        { params: tipo ? { tipo } : undefined }
      );
      return CajaMovimientoListAdapter(response.data.data || []);
    },
  });
};

export const useCrearMovimiento = () => {
  const queryClient = useQueryClient();
  return useMutation<CajaMovimiento, Error, { idsesion: number; payload: MovimientoPayload }>({
    mutationFn: async ({ idsesion, payload }) => {
      const response = await axiosClient.post<ApiResponse<ApiCajaMovimiento>>(
        `${base}/sesiones/${idsesion}/movimientos`,
        payload
      );
      return CajaMovimientoAdapter(response.data.data);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['caja-movimientos', variables.idsesion] });
      queryClient.invalidateQueries({ queryKey: ['caja-arqueo', variables.idsesion] });
      queryClient.invalidateQueries({ queryKey: ['caja-sesion-actual'] });
      queryClient.invalidateQueries({ queryKey: ['caja-sesion', variables.idsesion] });
    },
    onError: (error) => {
      throw new Error(getErrorMessage(error));
    },
  });
};
