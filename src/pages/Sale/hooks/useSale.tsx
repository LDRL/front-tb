import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { v4 as uuidv4 } from 'uuid';

import { mapSaleToCreatePayload, SaleListAdapter } from '../adapter';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { pageSize, PaginationModel } from '@/utils';
import { fetchSaleCreate } from '../services/sale';
import axiosClient, { getErrorMessage } from '@/utils/axiosClient';
import { ApiHeaderSale, ApiSale } from '../models/sale.api.type';
import { ApiResponseClient, Client } from '@/pages/Client/models';
import { Detail, Sale, SaleList } from '../models/sale.domain.type';


import { ClientAdapter } from '@/pages/Client/adapter';
import { userKey } from '@/redux/authSlice';
import { editClient } from '@/redux/clientSlice';
import { AuthUser } from '@/modules/auth/models/login.domain.type';

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
    data: ApiHeaderSale;
}

// Hook para obtener la lista de ventas

export const useFetchSales = (page: number = 1, search: string) => {
    return useQuery<ApiResponse, Error>({
        queryKey: ['sales', page, search],
        queryFn: async () => {
            const response = await axiosClient.get<ApiResponse>(`${apiUrl}ventas/?page=${page}&search=${search}`);
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
    const auth = localStorage.getItem(userKey);

    const usuario: AuthUser | null = auth
    ? JSON.parse(auth).user
    : null;

    const idsucursal = usuario?.branchId;
    const idusuario = usuario?.id;

    return useMutation<string, Error, Sale>({
        mutationFn: async (newSale) => {

            if (!idsucursal) throw new Error("No sucursal");
            if (!idusuario) throw new Error("No usuario");

            const payload = mapSaleToCreatePayload(
                newSale,
                Number(idusuario),
                idsucursal
            );

            const [error, nuevaOrden] = await fetchSaleCreate(
                `${apiUrl}ventas`,
                payload
            );

            if (error) {
                throw error;
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
            const response = await axiosClient.get<ApiResponseHeader>(`${apiUrl}ventas/${id}/`);
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
            const response = await axiosClient.get<ApiResponseClient>(`${apiUrl}clientes?search=${nit}`);
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
    const dispatch = useDispatch();

    const search = useSelector(
      (state:any) => state.client.searchNit
    );

    const [client, setClient] = useState<Client | null>(null);

    const { data, error, isLoading } = useFetchClient(search);

    useEffect(() => {

        if (!data) return;

        // No existe cliente
        if (data.data.length === 0) {
            setClient(null);

            // 👇 limpiar redux
            dispatch(editClient(null));

            return;
        }

        // Cliente encontrado
        const adaptedClient = ClientAdapter(
            data.data[0]
        );

        // estado local
        setClient(adaptedClient);

        // 👇 ACTUALIZA REDUX
        dispatch(editClient(adaptedClient));

    }, [data, dispatch]);

    const errorMessage = error
      ? getErrorMessage(error)
      : null;

    return {
        client,
        isLoading,
        error: errorMessage
    };
};



//Detail
export const useSaleDetails = () => {
  const [rows, setRows] = useState<Detail[]>([]);
  const [total, setTotal] = useState(0);

  const calculateTotal = (rows: Detail[]) => {
    const total = rows.reduce((acc, r) => acc + (r.subtotal ?? 0), 0);
    setTotal(total);
  };

  const addRow = (detail: Detail) => {
    setRows(prev => {
      const existing = prev.find(r => r.codProductPresentation === detail.codProductPresentation);
      if (existing) {
        const updated = prev.map(r =>
          r.codProductPresentation === detail.codProductPresentation
            ? {
                ...r,
                amount: r.amount + detail.amount,
                subtotal: (r.amount + detail.amount) * r.cost,
              }
            : r
        );
        calculateTotal(updated);
        return updated;
      }
      const updated = [
        ...prev,
        { ...detail, id: uuidv4() },
      ];
      calculateTotal(updated);
      return updated;
    });
  };

  const deleteRow = (id: string) => {
    setRows(prev => {
      const updated = prev.filter(r => r.id !== id);
      calculateTotal(updated);
      return updated;
    });
  };

  return { rows, total, addRow, deleteRow };
};