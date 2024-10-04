import axios from 'axios';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { PaginationModel, pageSize } from '@/utils';
import { BrandAdapter, BrandListAdapter } from '../adapter';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BrandList, ApiResponse, Brand, ApiBrand } from '../models';

const apiUrl = import.meta.env.VITE_API_URL;

export const useFetchBrands = (page: number = 1, search: string) => {
    return useQuery<ApiResponse, Error>({
        queryKey: ['brands', page, search],
        queryFn: async () => {
            const response = await axios.get<ApiResponse>(`${apiUrl}marcas/?page=${page}&search=${search}`);
            return response.data;   
        }
    });
};

//Hook for list brands and search for name

export const useBrand = (initialPage: number = 1) => {
    const search = useSelector((state:any) => state.product.search);

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
            const adaptedProducts = data ? BrandListAdapter(data.marcas) : []; // Todo cambiar a data cuando en la api mande data en ves de marcas
            setBrands(adaptedProducts || []);
            setTotal(data?.total || 0);
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
            const response = await axios.get<{ marcas: ApiBrand }>(`${apiUrl}marcas/${brandId}/`);

            if (response.status !== 200) {
                throw new Error('Error al cargar la marca');
            }

            return BrandAdapter(response.data.marcas); // Adaptamos y devolvemos el producto
        },
    });
};


// Hook for create new Brand
export const useCreateBrand = () => {
    const queryClient = useQueryClient();

    return useMutation<Brand, Error, Brand>({
        mutationFn: async (newBrand) => {
            const brand = {
                nombre: newBrand.name,
            };

            const response = await axios.post<{ message: string, marcas: ApiBrand }>(`${apiUrl}marcas/`, brand);

            if (response.status !== 201) {
                throw new Error('Error al crear la marca');
            }

            return BrandAdapter(response.data.marcas);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['brands'] });
        },
        onError: (error) => {
            alert(`Error al crear la marca: ${error.message}`);
            // TODO:  Considerar usar un componente de notificación en lugar de alert
            console.error(`Error al crear marca: ${error}`);
        },
    });
};

// Hook para actualizar un producto existente
export const useUpdateBrand = () => {
    const queryClient = useQueryClient();

    return useMutation<Brand, Error, Brand>({
        mutationFn: async (updatedBrand) => {
            const brand = {
                nombre: updatedBrand.name,
            };

            const response = await axios.put<{ message: string, body: ApiBrand }>(`${apiUrl}marcas/${updatedBrand.id}/`, brand);

            if (response.status !== 201) {
                throw new Error('Error al actualizar la marca');
            }

            return BrandAdapter(response.data.body); // Se adpata la Branda y se retorna actualizado
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['brands'] });
        },
        onError: (error) => {
            console.error(`Error updating Brand: ${error}`);
        },
    });
};