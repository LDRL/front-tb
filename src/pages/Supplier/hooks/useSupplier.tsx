import axios from 'axios';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { PaginationModel, pageSize } from '@/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiGetSupplierList, ApiResponse, Supplier, SupplierList } from '@/pages/Supplier';
import { getErrorMessage } from '@/utils/axiosClient';

const apiUrl = import.meta.env.VITE_API_URL;

export const useFetchProviders = (page: number = 1, search: string) => {
    return useQuery<ApiResponse, Error>({
        queryKey: ['providers', page, search],
        queryFn: async () => {
            const response = await axios.get<ApiResponse>(`${apiUrl}proveedor/?page=${page}&search=${search}`);
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
            //const adaptedProducts = data ? providerListAdapter(data.presentacion) : []; // Todo cambiar a data cuando en la api mande data en ves de usuarios
            //setProviders(adaptedProducts || []);
            setProviders(data.proveedor || []);
            setTotal(data?.total || 0);
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
            const response = await axios.get<ApiGetSupplierList>(`${apiUrl}proveedor/${supplierId}/`);

            if (response.status !== 200) {
                throw new Error('Error al cargar el proveedor');
            }

            return response.data.proveedor;
        },
    });
};


// Hook for create new provider
export const useCreateSupplier = () => {
    const queryClient = useQueryClient();

    return useMutation<Supplier, unknown, Supplier>({
        mutationFn: async (newSupplier) => {
            const supplier = {
                nombre: newSupplier.nombre,
                direccion: newSupplier.direccion,
                telefono: newSupplier.telefono,
                email: newSupplier.email,
                estado: 1
            };

            const response = await axios.post<{ message: string, usuario: Supplier }>(`${apiUrl}proveedor/`, supplier);

            if (response.status !== 201) {
                throw new Error('Error al crear proveedor');
            }

            return response.data.usuario;
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

// Hook para actualizar un producto existente
export const useUpdateSupplier = () => {
    const queryClient = useQueryClient();

    return useMutation<Supplier, Error, Supplier>({
        mutationFn: async (updatedSupplier) => {
            const supplier = {
                nombre: updatedSupplier.nombre,
                direccion: updatedSupplier.direccion,
                telefono: updatedSupplier.telefono,
                email: updatedSupplier.email,
                estado: 1
            };

            const response = await axios.put<{ message: string, body: Supplier }>(`${apiUrl}proveedor/${updatedSupplier._id}/`, supplier);

            return response.data.body; 
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['providers'] });
        },
        onError: (error) => {
            console.error(`Error : ${error}`);
        },
    });
};