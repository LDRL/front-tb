import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { PaginationModel, pageSize } from '@/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import axiosClient, { getErrorMessage } from '@/utils/axiosClient';
import { UserApiResponseList } from '../models/user.response.type';
import { UserApi } from '../models/user.api.type';
import { UserList } from '../models/user.view.type';
import { AuthUser } from '@/modules/auth/models/login.domain.type';
import { userKey } from '@/redux/authSlice';

const apiUrl = import.meta.env.VITE_API_URL;

export const useFetchUsers = (page: number = 1, search: string) => {
    return useQuery<UserApiResponseList, Error>({
        queryKey: ['users', page, search],
        queryFn: async () => {
            const response = await axiosClient.get<UserApiResponseList>(`${apiUrl}usuarios/?page=${page}&search=${search}`);
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
            setUsers(data.data || []);
            setTotal(data?.meta.total || 0);
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
    return useQuery<UserApi, Error>({
        queryKey: ['user', UserId], // Clave de consulta
        queryFn: async () => {
            const response = await axiosClient.get<UserApi>(`${apiUrl}usuarios/${UserId}/`);
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
    const auth = localStorage.getItem(userKey);
    const usuario: AuthUser | null = auth
        ? JSON.parse(auth).user
        : null;
    
    const idsucursal = usuario?.branchId;

    return useMutation<UserApi, unknown, UserApi>({
        mutationFn: async (newUser) => {

            if (!idsucursal) throw new Error("No sucursal");

            const user = {
                nombre: newUser.nombre,
                apellido: newUser.apellido,
                username: newUser.username,
                email: newUser.email,
                password: newUser.password,
                imagen: "ruta_imagen",
                estado: 1,
                idsucursal: idsucursal,
                codigoemp: newUser.codigoemp,
                roles: newUser.roles ? newUser.roles : []
            };

            //const response = await axios.post<{ message: string, presentacion: Apiuser }>(`${apiUrl}usuarios/`, user);

            const response = await axiosClient.post<{ message: string, usuario: UserApi }>(`${apiUrl}usuarios/`, user);

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

    return useMutation<UserApi, Error, UserApi>({
        mutationFn: async (updatedUser) => {
            const user: Partial<UserApi> = {
                nombre: updatedUser.nombre,
                apellido: updatedUser.apellido,
                username: updatedUser.username,
                email: updatedUser.email,
                imagen: "update_ruta_imagen",
                estado: 1,
                roles: updatedUser.roles ? updatedUser.roles : []
            };

            if (updatedUser.password) {
                user.password = updatedUser.password;
            }

            const response = await axiosClient.put<{ message: string, body: UserApi }>(`${apiUrl}usuarios/${updatedUser._id}/`, user);

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