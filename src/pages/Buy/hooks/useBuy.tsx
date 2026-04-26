import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';


import { BuyAdapter, BuyListAdapter, mapBuyToCreatePayload } from '../adapter';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { pageSize, PaginationModel } from '@/utils';
import { fetchBuyCreate } from '../services/buy';
import { User } from '@/pages/User';
import { userKey } from '@/redux/user';
import { ApiBuy, ApiHeaderBuy } from '../models/buy.api.type';
import { Buy, BuyList, Detail } from '../models/buy.domain.type';
import { ApiBuyResponse } from '../models/buy.response.type';

const apiUrl = import.meta.env.VITE_API_URL;

export interface ApiResponse {
    message: string;
    data: ApiBuy[]; //Todo cambiar a data cuando en la api mande data en ves de marcas
    ok: boolean;
    meta: {
        total: number,
        totalPage: number,
        currentPage: number,
        limit: number
    }
}

interface ApiResponseHeader {
    data: ApiHeaderBuy;
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
            const adaptedProducts = data ? BuyListAdapter(data.data) : []; // Todo cambiar a data cuando en la api mande data en ves de marcas
            setBuys(adaptedProducts || []);
            setTotal(data?.meta.total || 0);
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



// Hook para crear un nuevo producto
export const useCreateBuy = () => {
    const queryClient = useQueryClient();
    //const auth = localStorage.getItem('usuario');
    const auth = localStorage.getItem(userKey);

    const usuario: User | null = auth
    ? JSON.parse(auth).usuario
    : null;

    const idsucursal = usuario?.idsucursal;
    const idusuario = usuario?._id;


    return useMutation<Buy, Error | unknown, Buy>({
        mutationFn: async (newBuy) => {
            if (!idsucursal) throw new Error("No sucursal");
            if (!idusuario) throw new Error("No usuario");

            const payload = mapBuyToCreatePayload(
                newBuy,
                Number(idusuario),
                idsucursal
            );

            const [error, producto] = await fetchBuyCreate(
                `${apiUrl}compras`,
                payload
            );

            if (error) throw error;

            if (!producto) {
                throw new Error('Producto no creado');
            }

            return producto;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['buys'] });
        },
        onError: (error) => {
            console.log(error);
        },
    });
};

export const useShowBuy = (id:string) => {
    return useQuery<ApiResponseHeader, Error>({
        queryKey: ['showBuy',id],
        queryFn: async () => {
            const response = await axios.get<ApiResponseHeader>(`${apiUrl}compras/${id}/`);
            return response.data;   
        }
    });
};

//Detail Create
export const useBuyDetails = () => {
  const [rows, setRows] = useState<Detail[]>([]);
  const [total, setTotal] = useState(0);

  const calculateTotal = (rows: Detail[]) => {
    const total = rows.reduce((acc, r) => acc + (r.subtotal ?? 0), 0);
    setTotal(total);
  };

  const addRow = (detail: Detail) => {
    setRows(prev => {
      const updated = [...prev, { ...detail, id: prev.length }];
      calculateTotal(updated);
      return updated;
    });
  };

  const deleteRow = (id: number) => {
    setRows(prev => {
      const updated = prev.filter(r => r.id !== id);
      calculateTotal(updated);
      return updated;
    });
  };

  return { rows, total, addRow, deleteRow };
};