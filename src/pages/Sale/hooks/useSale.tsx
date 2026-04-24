import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

import {ApiSale, SaleList, Sale, ApiHeaderSale, ClientOrden, ApiClient } from "../models";
import { SaleAdapter, SaleClientAdapter, SaleListAdapter } from '../adapter';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { pageSize, PaginationModel } from '@/utils';
import { fetchSaleCreate } from '../services/sale';
import { getErrorMessage } from '@/utils/axiosClient';

const apiUrl = import.meta.env.VITE_API_URL;

interface ApiResponse {
    msg: string;
    data: ApiSale[];
    meta: {
        total: number;
        currentPage: number;
        limit: number;
        totalPages: number;
    };
    ok:boolean;
}

interface ApiResponseHeader {
    orden: ApiHeaderSale;
}

interface ApiResponseClient {
    message: string;
    data: ApiClient[];
    ok: boolean;
}
// Hook para obtener la lista de ventas

export const useFetchSales = (page: number = 1, search: string) => {
    return useQuery<ApiResponse, Error>({
        queryKey: ['sales', page, search],
        queryFn: async () => {
            const response = await axios.get<ApiResponse>(`${apiUrl}ventas/?page=${page}&search=${search}`);
            return response.data;   
        }
    });
};

//Hook for list brands and search for name

export const useSale = (initialPage: number = 1) => {
    const search = useSelector((state:any) => state.sale.search);

    const [sales, setSales] = useState<SaleList>([]);
    const [totalSale, setTotal] = useState<number>(0);
    const [page, setPage] = useState<number>(initialPage);

    const [paginationModel, setPaginationModel] = useState<PaginationModel>({
        page: initialPage - 1,
        pageSize: pageSize,
    });

    const { data, error, isLoading } = useFetchSales(page,search);

    useEffect(() => {
        if(data){
            const adaptedSales = data ? SaleListAdapter(data.data) : []; // Todo cambiar a data cuando en la api mande data en ves de ventas

            setSales(adaptedSales || []);
            setTotal(data?.meta.total || 0);
        }
    }, [data]);

    const handlePaginationModelChange = (newPaginationModel: PaginationModel) => {
        setPaginationModel(newPaginationModel);
        const newPage = newPaginationModel.page + 1;
        setPage(newPage);
    };

    return {
        sales,
        totalSale,
        isLoading,
        error,
        paginationModel,
        handlePaginationModelChange,
    };
};


// Hook para crear un nuevo producto
export const useCreateSale = () => {
    const queryClient = useQueryClient();

    return useMutation<string, Error, Sale>({
        mutationFn: async (newSale) => {

            const [error, nuevaOrden] = await fetchSaleCreate(`${apiUrl}ventas`,newSale);

            if (error){
                throw new Error('Error al vender el producto');
            }

            if (!nuevaOrden) {
                throw new Error('Orden no creado');
            }

            return "creado ";
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sales'] });
        }
    });
};

export const useShowSale = (id:string) => {
    return useQuery<ApiResponseHeader, AxiosError>({
        queryKey: ['showSale',id],
        queryFn: async () => {
            const response = await axios.get<ApiResponseHeader>(`${apiUrl}ventas/${id}/`);
            return response.data;   
        }
    });
};
///localhost:8080/api/clientes?seaarch=CF
// hook para obtener un cliente por nit
export const useFetchClient = (nit: string) => {
    return useQuery<ApiResponseClient, AxiosError>({
        queryKey: ['sales', nit],
        queryFn: async () => {
            const response = await axios.get<ApiResponseClient>(`${apiUrl}clientes?search=${nit}`);
            return response.data;   
        },
        enabled: !!nit,
        retry: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false
    });
};

//hook para buscar cliente por nit
export const useClientSearch = () => {
    const search = useSelector((state:any) => state.sale.nit);
    const [client, setClient] = useState<ClientOrden>();
    const { data, error, isLoading } = useFetchClient(search);

    useEffect(() => {
        if(data){
            const adaptedSales = SaleClientAdapter(data?.data?.[0] ?? null);
            setClient(adaptedSales || "");
        }
    }, [data]);

    const errorMessage = error ?  getErrorMessage(error) : null;
    return {
        client,
        isLoading,
        error: errorMessage
    };
};






