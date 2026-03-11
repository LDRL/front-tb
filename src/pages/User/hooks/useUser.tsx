import axios from 'axios';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { PaginationModel, pageSize } from '@/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiResponse, User, UserList } from '@/pages/User';
import { getErrorMessage } from '@/utils/axiosClient';

const apiUrl = import.meta.env.VITE_API_URL;

export const useFetchUsers = (page: number = 1, search: string) => {
    return useQuery<ApiResponse, Error>({
        queryKey: ['users', page, search],
        queryFn: async () => {
            const response = await axios.get<ApiResponse>(`${apiUrl}usuarios/?page=${page}&search=${search}`);
            return response.data;   
        }
    });
};

//Hook for list Users and search for name

export const useUser = (initialPage: number = 1) => {
    const search = useSelector((state:any) => state.user.search);

    const [users, setUsers] = useState<UserList>([]);
    const [totalUser, setTotal] = useState<number>(0);
    const [page, setPage] = useState<number>(initialPage);


    const [paginationModel, setPaginationModel] = useState<PaginationModel>({
        page: initialPage - 1,
        pageSize: pageSize,
    });

    const { data, error, isLoading } = useFetchUsers(page,search);

    useEffect(() => {
        if(data){
            //const adaptedProducts = data ? userListAdapter(data.presentacion) : []; // Todo cambiar a data cuando en la api mande data en ves de usuarios
            //setUsers(adaptedProducts || []);
            setUsers(data.usuarios || []);
            setTotal(data?.total || 0);
        }
    }, [data, search]);

    const handlePaginationModelChange = (newPaginationModel: PaginationModel) => {
        setPaginationModel(newPaginationModel);
        const newPage = newPaginationModel.page + 1;
        setPage(newPage);
    };

    return {
        users,
        totalUser,
        isLoading,
        error,
        paginationModel,
        handlePaginationModelChange,
    };
};

// Hook for get an user for id
export const useGetUser = (UserId: string) => {
    return useQuery<User, Error>({
        queryKey: ['user', UserId], // Clave de consulta
        queryFn: async () => {
            const response = await axios.get<User>(`${apiUrl}usuarios/${UserId}/`);

            if (response.status !== 200) {
                throw new Error('Error al cargar la presentación');
            }

            return response.data;

         },
    });
};


// Hook for create new user
export const useCreateUser = () => {
    const queryClient = useQueryClient();

    return useMutation<User, unknown, User>({
        mutationFn: async (newUser) => {
            const user = {
                nombre: newUser.nombre,
                apellido: newUser.apellido,
                username: newUser.username,
                email: newUser.email,
                password: newUser.password,
                imagen: "ruta_imagen",
                estado: 1
            };

            //const response = await axios.post<{ message: string, presentacion: Apiuser }>(`${apiUrl}usuarios/`, user);

            const response = await axios.post<{ message: string, usuario: User }>(`${apiUrl}usuarios/`, user);

            if (response.status !== 201) {
                throw new Error('Error al crear usuario');
            }

            return response.data.usuario;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        onError: (error) => {
            const message = getErrorMessage(error);
            throw new Error(message);
        },
    });
};

// Hook para actualizar un producto existente
export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation<User, Error, User>({
        mutationFn: async (updatedUser) => {
            const user: Partial<User> = {
                nombre: updatedUser.nombre,
                apellido: updatedUser.apellido,
                username: updatedUser.username,
                email: updatedUser.email,
                imagen: "update_ruta_imagen",
                estado: 1
            };

            if (updatedUser.password) {
                user.password = updatedUser.password;
            }

            const response = await axios.put<{ message: string, body: User }>(`${apiUrl}usuarios/${updatedUser.codigoemp}/`, user);

            if (response.status !== 200) {
                throw new Error('Error al actualizar el usuario');
            }

            return response.data.body; 
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        onError: (error) => {
            console.error(`Error : ${error}`);
        },
    });
};