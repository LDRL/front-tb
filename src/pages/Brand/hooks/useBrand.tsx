import axios from 'axios';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { PaginationModel, pageSize } from '@/utils';
import { BrandAdapter, BrandListAdapter } from '../adapter';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BrandList, ApiResponseBrand, Brand, ApiBrand, CreateOrUpdateBrandResponse } from '../models';
import { getErrorMessage } from '@/utils/axiosClient';

const apiUrl = import.meta.env.VITE_API_URL;

export const useFetchBrands = (page: number = 1, search: string) => {
    return useQuery<ApiResponseBrand, Error>({
        queryKey: ['brands', page, search],
        queryFn: async () => {
            const response = await axios.get<ApiResponseBrand>(`${apiUrl}marcas/?page=${page}&search=${search}`);
            return response.data;   
        }
    });
};

//Hook for list brands and search for name

export const useBrand = (initialPage: number = 1) => {
    const search = useSelector((state:any) => state.brand.search);

    const [brands, setBrands] = useState<BrandList>([]);
    const [totalBrand, setTotal] = useState<number>(0);
    const [page, setPage] = useState<number>(initialPage);


    const [paginationModel, setPaginationModel] = useState<PaginationModel>({
        page: initialPage - 1,
        pageSize: pageSize,
    });

    const { data, error, isLoading } = useFetchBrands(page,search);

    useEffect(() => {
        if(data){
            const adaptedProducts = data ? BrandListAdapter(data.data) : []; // Todo cambiar a data cuando en la api mande data en ves de marcas
            setBrands(adaptedProducts || []);
            setTotal(data?.meta.total || 0);
        }
    }, [data]);

    const handlePaginationModelChange = (newPaginationModel: PaginationModel) => {
        setPaginationModel(newPaginationModel);
        const newPage = newPaginationModel.page + 1;
        setPage(newPage);
    };

    return {
        brands,
        totalBrand,
        isLoading,
        error,
        paginationModel,
        handlePaginationModelChange,
    };
};

// Hook for get an Brand for id
export const useGetBrand = (brandId: string) => {
    return useQuery<Brand, Error>({
        queryKey: ['brand', brandId], // Clave de consulta
        queryFn: async () => {
            const response = await axios.get<{ data: ApiBrand }>(`${apiUrl}marcas/${brandId}/`);

            if (response.status !== 200) {
                throw new Error('Error al cargar la marca');
            }

            return BrandAdapter(response.data.data); // Adaptamos y devolvemos el producto
        },
    });
};


// Hook for create new Brand
export const useCreateBrand = () => {
    const queryClient = useQueryClient();

    return useMutation<Brand, unknown, Brand>({
        mutationFn: async (newBrand) => {
            const brand = {
                nombre: newBrand.name,
            };

            //const response = await axios.post<{ message: string, marcas: ApiBrand }>(`${apiUrl}marcas/`, brand);

            const response = await axios.post<CreateOrUpdateBrandResponse>(
                `${apiUrl}marcas/`,
                brand
            );

            if (response.status !== 201) {
                throw new Error('Error al crear la marca');
            }

            return BrandAdapter(response.data.data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['brands'] });
        },
        onError: (error) => {
            const message = getErrorMessage(error);
            throw new Error(message);
        },
    });
};

// Hook para actualizar un producto existente
export const useUpdateBrand = () => {
    const queryClient = useQueryClient();

    return useMutation<Brand, unknown, Brand>({
        mutationFn: async (updatedBrand) => {
            const brand = {
                nombre: updatedBrand.name,
            };

            const response = await axios.put<CreateOrUpdateBrandResponse>(`${apiUrl}marcas/${updatedBrand.id}/`, brand);

            if (response.status !== 200) {
                throw new Error('Error al actualizar la marca');
            }

            return BrandAdapter(response.data.data); // Se adpata la Branda y se retorna actualizado
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['brands'] });
        },
        onError: (error) => {
            const message = getErrorMessage(error);
            throw new Error(message);
        },
    });
};