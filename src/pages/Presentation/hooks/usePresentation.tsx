import axios from 'axios';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { PaginationModel, pageSize } from '@/utils';
import { PresentationAdapter, PresentationListAdapter } from '../adapter';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PresentationList, ApiResponse, Presentation, ApiPresentation } from '../models';

const apiUrl = import.meta.env.VITE_API_URL;

export const useFetchPresentations = (page: number = 1, search: string) => {
    return useQuery<ApiResponse, Error>({
        queryKey: ['presentations', page, search],
        queryFn: async () => {
            const response = await axios.get<ApiResponse>(`${apiUrl}Presentaciones/?page=${page}&search=${search}`);
            return response.data;   
        }
    });
};

//Hook for list presentations and search for name

export const usePresentation = (initialPage: number = 1) => {
    const search = useSelector((state:any) => state.presentation.search);

    const [presentations, setPresentations] = useState<PresentationList>([]);
    const [totalPresentation, setTotal] = useState<number>(0);
    const [page, setPage] = useState<number>(initialPage);


    const [paginationModel, setPaginationModel] = useState<PaginationModel>({
        page: initialPage - 1,
        pageSize: pageSize,
    });

    const { data, error, isLoading } = useFetchPresentations(page,search);

    useEffect(() => {
        if(data){
            const adaptedProducts = data ? PresentationListAdapter(data.presentacion) : []; // Todo cambiar a data cuando en la api mande data en ves de presentaciones
            setPresentations(adaptedProducts || []);
            setTotal(data?.total || 0);
        }
    }, [data, search]);

    const handlePaginationModelChange = (newPaginationModel: PaginationModel) => {
        setPaginationModel(newPaginationModel);
        const newPage = newPaginationModel.page + 1;
        setPage(newPage);
    };

    return {
        presentations,
        totalPresentation,
        isLoading,
        error,
        paginationModel,
        handlePaginationModelChange,
    };
};

// Hook for get an Presentation for id
export const useGetPresentation = (presentationId: string) => {
    return useQuery<Presentation, Error>({
        queryKey: ['presentation', presentationId], // Clave de consulta
        queryFn: async () => {
            const response = await axios.get<{ presentacion: ApiPresentation }>(`${apiUrl}presentaciones/${presentationId}/`);

            if (response.status !== 200) {
                throw new Error('Error al cargar la presentación');
            }

            return PresentationAdapter(response.data.presentacion); // Adaptamos y devolvemos el producto
        },
    });
};


// Hook for create new Presentation
export const useCreatePresentation = () => {
    const queryClient = useQueryClient();

    return useMutation<Presentation, Error, Presentation>({
        mutationFn: async (newPresentation) => {
            const presentation = {
                nombre: newPresentation.name,
            };

            const response = await axios.post<{ message: string, presentacion: ApiPresentation }>(`${apiUrl}presentaciones/`, presentation);

            if (response.status !== 201) {
                throw new Error('Error al crear la presentación');
            }

            return PresentationAdapter(response.data.presentacion);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['presentations'] });
        },
        onError: (error) => {
            alert(`Error al crear la presentación: ${error.message}`);
            // TODO:  Considerar usar un componente de notificación en lugar de alert
            console.error(`Error al crear presentación: ${error}`);
        },
    });
};

// Hook para actualizar un producto existente
export const useUpdatePresentation = () => {
    const queryClient = useQueryClient();

    return useMutation<Presentation, Error, Presentation>({
        mutationFn: async (updatedPresentation) => {
            const presentation = {
                nombre: updatedPresentation.name,
            };

            const response = await axios.put<{ message: string, body: ApiPresentation }>(`${apiUrl}presentaciones/${updatedPresentation.id}/`, presentation);

            if (response.status !== 201) {
                throw new Error('Error al actualizar la presentación');
            }

            return PresentationAdapter(response.data.body); // Se adpata Presentation y se retorna actualizado
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['presetentions'] });
        },
        onError: (error) => {
            console.error(`Error updating Presentation: ${error}`);
        },
    });
};