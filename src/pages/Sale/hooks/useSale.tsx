import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

import {ApiSale, SaleList, Sale, ApiHeaderSale, ClientOrden, ApiClient } from "../models";
import { SaleAdapter, SaleClientAdapter, SaleListAdapter } from '../adapter';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { pageSize, PaginationModel } from '@/utils';
import { fetchSaleCreate } from '../services/sale';

const apiUrl = import.meta.env.VITE_API_URL;

interface ApiResponse {
    msg: string;
    ordenes: ApiSale[];
    total: number;
    currentPage: number;
}

interface ApiResponseHeader {
    orden: ApiHeaderSale;
}

interface ApiResponseClient {
    msg: string;
    cliente: ApiClient;
}
// Hook para obtener la lista de ventas

export const useFetchSales = (page: number = 1, search: string) => {
    return useQuery<ApiResponse, Error>({
        queryKey: ['sales', page, search],
        queryFn: async () => {
            const response = await axios.get<ApiResponse>(`${apiUrl}ordenes/?page=${page}&search=${search}`);
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
            const adaptedSales = data ? SaleListAdapter(data.ordenes) : []; // Todo cambiar a data cuando en la api mande data en ves de ventas

            setSales(adaptedSales || []);
            setTotal(data?.total || 0);
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







// Hook para obtener un producto específico
export const useFetchProduct = (productId: string) => {
    return useQuery<Sale, Error>({
        queryKey: ['product', productId], // Clave de consulta
        queryFn: async () => {
            const response = await axios.get<{ producto: ApiSale }>(`${apiUrl}${productId}/`);

            if (response.status !== 200) {
                throw new Error('Error al cargar el producto');
            }

            return SaleAdapter(response.data.producto); // Adaptamos y devolvemos el producto
        },
        enabled: !!productId, // Solo se ejecuta si productId está disponible
        // onError: (error) => {
        //     console.error(`Error fetching product: ${error}`);
        // },
    });
};

// Hook para crear un nuevo producto
export const useCreateSale = () => {
    const queryClient = useQueryClient();

    return useMutation<string, Error, Sale>({
        mutationFn: async (newSale) => {

            const [error, nuevaOrden, msg] = await fetchSaleCreate(`${apiUrl}ordenes`,newSale);

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
        },
        onError: (error) => {
            console.error(`Error creating product: ${error}`);
        },
    });
};

export const useShowSale = (id:string) => {
    return useQuery<ApiResponseHeader, AxiosError>({
        queryKey: ['showSale',id],
        queryFn: async () => {
            const response = await axios.get<ApiResponseHeader>(`${apiUrl}ordenes/${id}/`);
            return response.data;   
        }
    });
};

// hook para obtener un cliente por nit
export const useFetchClients = (nit: string) => {
    return useQuery<ApiResponseClient, AxiosError>({
        queryKey: ['sales', nit],
        queryFn: async () => {
            const response = await axios.get<ApiResponseClient>(`${apiUrl}clientes/${nit}`);
            return response.data;   
        },
        enabled: !!nit,
        retry: false,
    });
};



//hook para buscar cliente por nit
export const useClientSearch = () => {
    const search = useSelector((state:any) => state.sale.nit);
    const [client, setClient] = useState<ClientOrden>();
    const { data, error, isLoading } = useFetchClients(search);

    useEffect(() => {
        if(data){
            console.log(data?.cliente)

            const adaptedSales = SaleClientAdapter(data.cliente); // Todo cambiar a data cuando en la api mande data en ves de ventas
            setClient(adaptedSales || "");
        }
    }, [data]);

    const errorMessage = error ? (
        // Verificamos si el error es de tipo AxiosError y si tiene 'response'
        (error instanceof AxiosError && error.response)
            ? ` ${(error as AxiosError).response?.data?.error || 'Cliente no encontrado'}`
            : `Error desconocido: ${(error instanceof Error ? error.message : 'No se pudo obtener el cliente')}`
    ) : null;

    


    return {
        client,
        isLoading,
        error: errorMessage
    };
};




