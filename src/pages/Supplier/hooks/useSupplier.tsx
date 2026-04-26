import axios from 'axios';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { PaginationModel, pageSize } from '@/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient, { getErrorMessage } from '@/utils/axiosClient';
import { ApiSupplier } from '../models/supplier.api.type';
import { ApiResponseSupplierList } from '../models/supplier.response.type';
import { Supplier, SupplierList } from '../models/supplier.domain.type';
import { mapApiToSupplier, mapSupplierToApi, SupplierListAdapter } from '../adapter/supplier.adapter';
import { SupplierForm } from '../models/supplier.view.type';
import { fetchSupplierCreate, fetchSupplierUpdate } from '../service/supplier';

const apiUrl = import.meta.env.VITE_API_URL;

export const useFetchProviders = (page: number = 1, search: string) => {
    return useQuery<ApiResponseSupplierList, Error>({
        queryKey: ['providers', page, search],
        queryFn: async () => {
            const response = await axios.get<ApiResponseSupplierList>(`${apiUrl}proveedor/?page=${page}&search=${search}`);
            return response.data;   
        }
    });
};

//Hook for list Providers and search for name

export const useSupplier = (initialPage: number = 1) => {
    const search = useSelector((state:any) => state.supplier.search);

    const [providers, setProviders] = useState<SupplierList>([]);
    const [totalProvieder, setTotal] = useState<number>(0);
    const [page, setPage] = useState<number>(initialPage);


    const [paginationModel, setPaginationModel] = useState<PaginationModel>({
        page: initialPage - 1,
        pageSize: pageSize,
    });

    const { data, error, isLoading } = useFetchProviders(page,search);

    useEffect(() => {
        if(data){
            const adaptedSuppliers = data ? SupplierListAdapter(data.data) : []; // Todo cambiar a data cuando en la api mande data en ves de usuarios
            setProviders(adaptedSuppliers || []);
            setTotal(data?.meta.total || 0);
        }
    }, [data, search]);

    const handlePaginationModelChange = (newPaginationModel: PaginationModel) => {
        setPaginationModel(newPaginationModel);
        const newPage = newPaginationModel.page + 1;
        setPage(newPage);
    };

    return {
        providers,
        totalProvieder,
        isLoading,
        error,
        paginationModel,
        handlePaginationModelChange,
    };
};

// Hook for get an provider for id
export const useGetSupplier = (supplierId: string) => {
    return useQuery<Supplier, Error>({
        queryKey: ['provieder', supplierId], // Clave de consulta
        queryFn: async () => {
      

            const response = await axiosClient.get<{ data: ApiSupplier }>(`${apiUrl}proveedor/${supplierId}/`);

            if (response.status !== 200) {
                throw new Error('Error al cargar el producto');
            }
            console.log(response.data);
            return mapApiToSupplier(response.data.data);
        },
    });
};


// Hook for create new provider
export const useCreateSupplier = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: SupplierForm) => {
            const payload = mapSupplierToApi(data);
            const [error, proveedor] = await fetchSupplierCreate(
            `${apiUrl}proveedor`,
                payload
            );

            if (error) throw error;
            if (!proveedor) throw new Error("Proveedor no creado");

            return proveedor;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['providers'] });
        },
        onError: (error) => {
            const message = getErrorMessage(error);
            throw new Error(message);
        },
    });
};

export type UpdateSupplierDTO = {
  code: number;
  data: SupplierForm;
};

// Hook para actualizar un producto existente
export const useUpdateSupplier = () => {
    const queryClient = useQueryClient();

    return useMutation ({
       mutationFn: async ({ code, data }: UpdateSupplierDTO) => {
            //const response = await axios.put<{ message: string, body: Supplier }>(`${apiUrl}proveedor/${updatedSupplier.code}/`, supplier);

            const payload = mapSupplierToApi(data);
            const [error, proveedor] = await fetchSupplierUpdate(
                `${apiUrl}proveedor/${code}`,
                payload
            );

            if (error) throw error;
            if (!proveedor) throw new Error('Error al actualizar el proveedor');

            return proveedor;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['providers'] });
        },
        onError: (error) => {
            console.error(`Error : ${error}`);
        },
    });
};