import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import axiosClient, { getErrorMessage } from "@/utils/axiosClient";
import { PaginationModel, pageSize } from "@/utils";
import { DescuentoAdapter, DescuentoListAdapter, DescuentoToFormAdapter } from "../adapter";
import {
  ApiDescuento,
  ApiResponseDescuento,
  Descuento,
  DescuentoFormValues,
  DescuentoList,
} from "../models";

const apiUrl = import.meta.env.VITE_API_URL;

export const useFetchDescuentos = (page: number = 1) => {
  return useQuery<ApiResponseDescuento, Error>({
    queryKey: ["descuentos", page],
    queryFn: async () => {
      const response = await axiosClient.get<ApiResponseDescuento>(
        `${apiUrl}descuentos?page=${page}&limit=${pageSize}`
      );
      return response.data;
    },
  });
};

export const useDescuento = (initialPage: number = 1) => {
  const [descuentos, setDescuentos] = useState<DescuentoList>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(initialPage);
  const [paginationModel, setPaginationModel] = useState<PaginationModel>({
    page: initialPage - 1,
    pageSize,
  });

  const { data, error, isLoading } = useFetchDescuentos(page);

  useEffect(() => {
    if (data) {
      setDescuentos(DescuentoListAdapter(data.data ?? []));
      setTotal(data.meta?.total ?? 0);
    }
  }, [data]);

  const handlePaginationModelChange = (newPaginationModel: PaginationModel) => {
    setPaginationModel(newPaginationModel);
    setPage(newPaginationModel.page + 1);
  };

  return {
    descuentos,
    total,
    isLoading,
    error,
    paginationModel,
    handlePaginationModelChange,
  };
};

export const useGetDescuento = (id?: string) => {
  return useQuery<DescuentoFormValues, Error>({
    queryKey: ["descuento", id],
    enabled: !!id,
    queryFn: async () => {
      const response = await axiosClient.get<{ data: ApiDescuento }>(`${apiUrl}descuentos/${id}`);
      return DescuentoToFormAdapter(response.data.data);
    },
  });
};

const toPayload = (form: DescuentoFormValues) => ({
  idprodPresenta: Number(form.productPresentationId),
  tipo_descuento: form.type,
  valorDescuento: Number(form.value),
  fechaIni: form.startDate ? form.startDate.format("YYYY-MM-DD") : null,
  fechaFin: form.endDate ? form.endDate.format("YYYY-MM-DD") : null,
  minimo: form.minimum === "" ? null : Number(form.minimum),
  estado: form.status ? 1 : 0,
});

export const useCreateDescuento = () => {
  const queryClient = useQueryClient();

  return useMutation<Descuento, Error, DescuentoFormValues>({
    mutationFn: async (form) => {
      const response = await axiosClient.post<{ data: ApiDescuento }>(
        `${apiUrl}descuentos`,
        toPayload(form)
      );
      return DescuentoAdapter(response.data.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["descuentos"] });
    },
    onError: (error) => {
      throw new Error(getErrorMessage(error));
    },
  });
};

export const useUpdateDescuento = () => {
  const queryClient = useQueryClient();

  return useMutation<Descuento, Error, DescuentoFormValues>({
    mutationFn: async (form) => {
      const response = await axiosClient.put<{ data: ApiDescuento }>(
        `${apiUrl}descuentos/${form.id}`,
        toPayload(form)
      );
      return DescuentoAdapter(response.data.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["descuentos"] });
      queryClient.invalidateQueries({ queryKey: ["descuento"] });
    },
    onError: (error) => {
      throw new Error(getErrorMessage(error));
    },
  });
};

export const useDeleteDescuento = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await axiosClient.delete(`${apiUrl}descuentos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["descuentos"] });
    },
    onError: (error) => {
      throw new Error(getErrorMessage(error));
    },
  });
};
