import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { PaginationModel, pageSize } from "@/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosClient, { getErrorMessage } from "@/utils/axiosClient";
import { ClientListAdapter, ClientAdapter } from "../adapter";
import {
    ClientList,
    ApiResponseClient,
    Client,
    ApiSingleClientResponse,
    ApiClient,
    CreateClientPayload,
    ClientForm,
} from "../models";

const apiUrl = import.meta.env.VITE_API_URL;

export const useFetchClients = (page: number = 1, search: string) => {
    return useQuery<ApiResponseClient, Error>({
        queryKey: ["clients", page, search],
        queryFn: async () => {
            const response = await axiosClient.get<ApiResponseClient>(
                `${apiUrl}clientes/?page=${page}&search=${search}`
            );
            return response.data;
        },
    });
};

export const useClient = (initialPage: number = 1) => {
    const search = useSelector((state: any) => state.client.search);

    const [clients, setClients] = useState<ClientList>([]);
    const [totalClient, setTotal] = useState<number>(0);
    const [page, setPage] = useState<number>(initialPage);

    const [paginationModel, setPaginationModel] = useState<PaginationModel>({
        page: initialPage - 1,
        pageSize: pageSize,
    });

    const { data, error, isLoading } = useFetchClients(page, search);

    useEffect(() => {
        if (data) {
            const adapted = ClientListAdapter(data.data);
            setClients(adapted);
            setTotal(data?.meta.total || 0);
        }
    }, [data]);

    const handlePaginationModelChange = (newPaginationModel: PaginationModel) => {
        setPaginationModel(newPaginationModel);
        const newPage = newPaginationModel.page + 1;
        setPage(newPage);
    };

    return {
        clients,
        totalClient,
        isLoading,
        error,
        paginationModel,
        handlePaginationModelChange,
    };
};

export const useGetClient = (clientId: string) => {
    return useQuery<Client, Error>({
        queryKey: ["client", clientId],
        queryFn: async () => {
            const response = await axiosClient.get<ApiSingleClientResponse>(
                `${apiUrl}clientes/${clientId}/`
            );
            if (response.status !== 200) {
                throw new Error("Error al cargar el cliente");
            }
            return ClientAdapter(response.data.data);
        },
    });
};

export const useCreateClient = () => {
    const queryClient = useQueryClient();

    return useMutation<Client, unknown, ClientForm>({
        mutationFn: async (form) => {
            const payload: CreateClientPayload = {
                nit: form.nit,
                nombres: form.name,
                apellidos: form.lastName,
                direccion: form.address,
                email: form.email,
                telefono: form.telphone,
                idtipoCli: form.idTypeCli,
            };

            const response = await axiosClient.post<
                { ok: boolean; message: string; data: ApiClient }
            >(`${apiUrl}clientes/`, payload);

            if (response.status !== 201) {
                throw new Error("Error al crear el cliente");
            }

            return ClientAdapter(response.data.data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clients"] });
        }
    });
};

export const useUpdateClient = () => {
    const queryClient = useQueryClient();

    return useMutation<Client, unknown, { id: number; form: ClientForm }>({
        mutationFn: async ({ id, form }) => {
            const payload: Partial<CreateClientPayload> = {
                nit: form.nit,
                nombres: form.name,
                apellidos: form.lastName,
                direccion: form.address,
                email: form.email,
                telefono: form.telphone,
                idtipoCli: form.idTypeCli,
            };

            const response = await axiosClient.put<
                { ok: boolean; message: string; data: ApiClient }
            >(`${apiUrl}clientes/${id}/`, payload);

            if (response.status !== 200) {
                throw new Error("Error al actualizar el cliente");
            }

            return ClientAdapter(response.data.data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clients"] });
        },
        onError: (error) => {
            const message = getErrorMessage(error);
            throw new Error(message);
        },
    });
};
