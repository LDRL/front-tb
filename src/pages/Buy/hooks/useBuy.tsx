import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosRequestConfig } from 'axios';

import {Total, ApiBuy, BuyList, Buy } from "../models";
import { BuyAdapter, BuyListAdapter } from '../adapter';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { pageSize, PaginationModel } from '@/utils';
import { fetchBuyCreate } from '../services/buy';

const apiUrl = import.meta.env.VITE_API_URL;

interface ApiResponse {
    msg: string;
    compras: ApiBuy[];
    total: number;
    currentPage: number;
}

// Hook para obtener la lista de compras

export const useFetchBuys = (page: number = 1, search: string) => {
    return useQuery<ApiResponse, Error>({
        queryKey: ['buys', page, search],
        queryFn: async () => {
            const response = await axios.get<ApiResponse>(`${apiUrl}compras/?page=${page}&search=${search}`);
            return response.data;   
        }
    });
};

//Hook for list brands and search for name

export const useBuy = (initialPage: number = 1) => {
    const search = useSelector((state:any) => state.brand.search);

    const [buys, setBuys] = useState<BuyList>([]);
    const [totalBuy, setTotal] = useState<number>(0);
    const [page, setPage] = useState<number>(initialPage);


    const [paginationModel, setPaginationModel] = useState<PaginationModel>({
        page: initialPage - 1,
        pageSize: pageSize,
    });

    const { data, error, isLoading } = useFetchBuys(page,search);

    useEffect(() => {
        if(data){
            const adaptedProducts = data ? BuyListAdapter(data.compras) : []; // Todo cambiar a data cuando en la api mande data en ves de marcas
            setBuys(adaptedProducts || []);
            setTotal(data?.total || 0);
        }
    }, [data]);

    const handlePaginationModelChange = (newPaginationModel: PaginationModel) => {
        setPaginationModel(newPaginationModel);
        const newPage = newPaginationModel.page + 1;
        setPage(newPage);
    };

    return {
        buys,
        totalBuy,
        isLoading,
        error,
        paginationModel,
        handlePaginationModelChange,
    };
};







// Hook para obtener un producto específico
export const useFetchProduct = (productId: string) => {
    return useQuery<Buy, Error>({
        queryKey: ['product', productId], // Clave de consulta
        queryFn: async () => {
            const response = await axios.get<{ producto: ApiBuy }>(`${apiUrl}${productId}/`);

            if (response.status !== 200) {
                throw new Error('Error al cargar el producto');
            }

            return BuyAdapter(response.data.producto); // Adaptamos y devolvemos el producto
        },
        enabled: !!productId, // Solo se ejecuta si productId está disponible
        // onError: (error) => {
        //     console.error(`Error fetching product: ${error}`);
        // },
    });
};

// Hook para crear un nuevo producto
export const useCreateBuy = () => {
    const queryClient = useQueryClient();

    return useMutation<Buy, Error, Buy>({
        mutationFn: async (newBuy) => {

            // const response = await axios.post<{ message: string, producto: ApiBuy }>(`${apiUrl}compras`, buy);
            const [error, producto] = await fetchBuyCreate(`${apiUrl}compras`,newBuy);

            if (error){
                throw new Error('Error al crear el producto');
            }

            if (!producto) {
                throw new Error('Producto no creado');
            }

            return producto;


            // return BuyAdapter(response.data.producto);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['buys'] });
        },
        onError: (error) => {
            console.error(`Error creating product: ${error}`);
        },
    });
};




// export const useFetchBuys = (page: number = 1, search: string) => {
//     return useQuery<ApiResponse, Error>({
//         queryKey: ['buys', page, search],
//         queryFn: async () => {
//             const response = await axios.get<ApiResponse>(`${apiUrl}?page=${page}&search=${search}`);
//             return response.data;
            
//         },
//         // staleTime: 60000, // 1 minuto
//         // cacheTime: 300000, // 5 minutos
//     });
// };