import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { PaginationModel, pageSize } from '@/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RoleListAdapter } from '../adapter';
import { RoleApi, RoleForm } from '../models/role.api.type';
import { RoleList } from '../models/role.view.type';
import { RoleApiResponse, RoleCreateResponse } from '../models/role.response.type';
import { Role } from '../models/role.domain.type';
import axiosClient, { getErrorMessage } from '@/utils/axiosClient';

const apiUrl = import.meta.env.VITE_API_URL;

export interface Permiso {
    _id: number;
    nombre: string;
}

interface PermisoResponse {
    ok: boolean;
    message: string;
    data: Permiso[];
    meta: { total: number };
}

export const useFetchPermisos = () => {
    return useQuery<Permiso[], Error>({
        queryKey: ['permisos'],
        queryFn: async () => {
            const response = await axiosClient.get<PermisoResponse>(`${apiUrl}permisos/`);
            return response.data.data;
        },
    });
};

export const useFetchRoles = (page: number = 1, search: string) => {
    return useQuery<RoleApiResponse, Error>({
        queryKey: ['roles', page, search],
        queryFn: async () => {
            const response = await axiosClient.get<RoleApiResponse>(`${apiUrl}roles/?page=${page}&search=${search}`);
            return response.data;
        }
    });
};

export const useRole = (initialPage: number = 1) => {
    const search = useSelector((state: any) => state.rol.search);

    const [roles, setRoles] = useState<RoleList>([]);
    const [totalRole, setTotal] = useState<number>(0);
    const [page, setPage] = useState<number>(initialPage);

    const [paginationModel, setPaginationModel] = useState<PaginationModel>({
        page: initialPage - 1,
        pageSize: pageSize,
    });

    const { data, error, isLoading } = useFetchRoles(page, search);

    useEffect(() => {
        if (data) {
            const adapted = data ? RoleListAdapter(data.data) : [];
            setRoles(adapted || []);
            setTotal(data?.meta.total || 0);
        }
    }, [data]);

    const handlePaginationModelChange = (newPaginationModel: PaginationModel) => {
        setPaginationModel(newPaginationModel);
        const newPage = newPaginationModel.page + 1;
        setPage(newPage);
    };

    return {
        roles,
        totalRole,
        isLoading,
        error,
        paginationModel,
        handlePaginationModelChange,
    };
};

export const useGetRole = (roleId: string) => {
    return useQuery<Role, Error>({
        queryKey: ['role', roleId],
        queryFn: async () => {
            const response = await axiosClient.get<{ data: RoleApi }>(`${apiUrl}roles/${roleId}/`);
            if (response.status !== 200) {
                throw new Error('Error al cargar el rol');
            }
            return RoleListAdapter([response.data.data])[0];
        },
    });
};

export const useCreateRole = () => {
    const queryClient = useQueryClient();

    return useMutation<RoleApi, unknown, RoleForm>({
        mutationFn: async (newRole) => {
            const payload = {
                nombrerol: newRole.nombrerol,
                permisos: newRole.permisos,
            };

            const response = await axiosClient.post<RoleCreateResponse>(
                `${apiUrl}roles/`,
                payload
            );

            if (response.status !== 201) {
                throw new Error('Error al crear el rol');
            }

            return response.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roles'] });
        },
        onError: (error) => {
            const message = getErrorMessage(error);
            throw new Error(message);
        },
    });
};

export const useUpdateRole = () => {
    const queryClient = useQueryClient();

    return useMutation<RoleApi, unknown, RoleForm>({
        mutationFn: async (updatedRole) => {
            const payload = {
                nombrerol: updatedRole.nombrerol,
                permisos: updatedRole.permisos,
            };

            const response = await axiosClient.put<RoleCreateResponse>(
                `${apiUrl}roles/${updatedRole._id}/`,
                payload
            );

            if (response.status !== 200) {
                throw new Error('Error al actualizar el rol');
            }

            return response.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roles'] });
        },
        onError: (error) => {
            const message = getErrorMessage(error);
            throw new Error(message);
        },
    });
};
