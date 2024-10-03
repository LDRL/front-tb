import axios from 'axios';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { PaginationModel, pageSize } from '@/utils';
import { CategoryAdapter, CategoryListAdapter } from '../adapter';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CategoryList, ApiResponse, Category, ApiCategory } from '../models';


const apiUrl = import.meta.env.VITE_API_URL;

export const useFetchCategories = (page: number = 1, search: string) => {
    return useQuery<ApiResponse, Error>({
        queryKey: ['categories', page, search],
        queryFn: async () => {
            const response = await axios.get<ApiResponse>(`${apiUrl}categorias/?page=${page}&search=${search}`);
            return response.data;   
        }
    });
};

//Hook for list categories and search for name

export const useCategory = (initialPage: number = 1) => {
    const search = useSelector((state:any) => state.product.search);

    const [categories, setCategories] = useState<CategoryList>([]);
    const [totalCategory, setTotal] = useState<number>(0);
    const [page, setPage] = useState<number>(initialPage);


    const [paginationModel, setPaginationModel] = useState<PaginationModel>({
        page: initialPage - 1,
        pageSize: pageSize,
    });

    const { data, error, isLoading } = useFetchCategories(page,search);

    useEffect(() => {
        if(data){
            const adaptedProducts = data ? CategoryListAdapter(data.data) : [];
            setCategories(adaptedProducts || []);
            setTotal(data?.total || 0);
        }
    }, [data]);

    const handlePaginationModelChange = (newPaginationModel: PaginationModel) => {
        console.log(newPaginationModel, "////////")
        setPaginationModel(newPaginationModel);
        const newPage = newPaginationModel.page + 1;
        setPage(newPage);
    };

    return {
        categories,
        totalCategory,
        isLoading,
        error,
        paginationModel,
        handlePaginationModelChange,
    };
};

// Hook for get an category for id
export const useGetCategory = (categoryId: string) => {
    return useQuery<Category, Error>({
        queryKey: ['category', categoryId], // Clave de consulta
        queryFn: async () => {
            const response = await axios.get<{ data: ApiCategory }>(`${apiUrl}categorias/${categoryId}/`);

            if (response.status !== 200) {
                throw new Error('Error al cargar el producto');
            }

            return CategoryAdapter(response.data.data); // Adaptamos y devolvemos el producto
        },
    });
};


// Hook for create new category
export const useCreateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation<Category, Error, Category>({
        mutationFn: async (newCategory) => {
            const category = {
                nombre: newCategory.name,
            };

            const response = await axios.post<{ message: string, data: ApiCategory }>(`${apiUrl}categorias/`, category);

            if (response.status !== 201) {
                throw new Error('Error al crear la categoria');
            }

            return CategoryAdapter(response.data.data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
        onError: (error) => {
            alert(`Error al crear la categoría: ${error.message}`);
            // TODO:  Considerar usar un componente de notificación en lugar de alert
            console.error(`Error al crear categoria: ${error}`);
        },
    });
};

// Hook para actualizar un producto existente
export const useUpdateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation<Category, Error, Category>({
        mutationFn: async (updatedCategory) => {
            const category = {
                nombre: updatedCategory.name,
            };

            const response = await axios.put<{ message: string, body: ApiCategory }>(`${apiUrl}categorias/${updatedCategory.id}/`, category);

            if (response.status !== 201) {
                throw new Error('Error al actualizar la categoria');
            }

            return CategoryAdapter(response.data.body); // Se adpata la categorya y se retorna actualizado
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
        onError: (error) => {
            console.error(`Error updating category: ${error}`);
        },
    });
};