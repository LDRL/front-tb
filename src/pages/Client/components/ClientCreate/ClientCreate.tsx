import React, { useEffect, useState } from "react";
import CardForm from "@/components/Cards/CardForm";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoadMask from "@/components/LoadMask/LoadMask";
import { FormAutocompleteAsync, FormInputText } from "@/components";
import { Box, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { RootState } from "@/redux/store";
import { ClientForm as ClientFormType } from "../../models";
import { PrivateRoutes } from "@/models";
import {
    useCreateClient,
    useGetClient,
    useUpdateClient,
} from "../../hooks/useClient";
import { clearClient, editClient } from "@/redux/clientSlice";
import Loading from "@/components/Loading";
import { toast } from "react-toastify";
import { Option, useFetchTypeClientsOptions } from "@/hooks/useOption";
import { getErrorMessage } from "@/utils/axiosClient";

const ClientCreate: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [subtitulo, setSubtitulo] = useState<string>("");
    const navigate = useNavigate();

    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch();
    const { currentClient } = useSelector((state: RootState) => state.client);

    const { control, handleSubmit, reset } = useForm<ClientFormType>({
        defaultValues: {
            nit: "",
            name: "",
            lastName: "",
            address: "",
            email: "",
            telphone: "",
            idTypeCli: 0,
        },
    });

    const { data: typeCliOptions = [], isLoading: isTypeCliLoading } =
        useFetchTypeClientsOptions();

    const { data} = id ? useGetClient(id) : { data: null };

    const createClientMutation = useCreateClient();
    const updateClientMutation = useUpdateClient();

    useEffect(() => {
        if (id && data) {
            dispatch(editClient(data));
            return;
        }
        dispatch(clearClient());
    }, [dispatch, data]);

    useEffect(() => {
        if (currentClient) {
            reset({
                nit: currentClient.nit,
                name: currentClient.name,
                lastName: currentClient.lastName,
                address: currentClient.direccion,
                email: currentClient.email,
                telphone: currentClient.telefono,
                idTypeCli: 0,
            });
            setSubtitulo("Editar");
        } else {
            reset({
                nit: "",
                name: "",
                lastName: "",
                address: "",
                email: "",
                telphone: "",
                idTypeCli: 0,
            });
            setSubtitulo("Nuevo");
        }
    }, [currentClient, reset]);

    const onSubmit = async (data: ClientFormType) => {
        setLoading(true);
        try {
            if (currentClient) {
                await updateClientMutation.mutateAsync({id: currentClient.id,form: data});
                toast.success("Cliente actualizado exitosamente");
            } else {
                await createClientMutation.mutateAsync(data);
                toast.success("Cliente creado exitosamente");
            }
            navigate(`/private/${PrivateRoutes.CLIENT}`, { replace: true });
        } catch (error: any) {
            toast.error(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

     

    return (
        <div className="container">
            {loading && <Loading loading />}

            <CardForm titulo="Cliente" subtitulo={subtitulo}>
                <LoadMask />
                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    autoComplete="off"
                >
                    <div className="section">
                        <FormInputText
                            name="nit"
                            control={control}
                            label="Nit"
                            rules={{ required: "El nit es requerido" }}
                        />
                    </div>

                    <div className="section">
                        <FormInputText
                            name="name"
                            control={control}
                            label="Nombres"
                            rules={{ required: "Los nombres son requeridos" }}
                        />
                    </div>

                    <div className="section">
                        <FormInputText
                            name="lastName"
                            control={control}
                            label="Apellidos"
                            rules={{ required: "Los apellidos son requeridos" }}
                        />
                    </div>

                    <div className="section">
                        <FormInputText
                            name="address"
                            control={control}
                            label="Dirección"
                            rules={{ required: "La dirección es requerida" }}
                        />
                    </div>

                    <div className="section">
                        <FormInputText
                            name="email"
                            control={control}
                            label="Correo electrónico"
                        />
                    </div>

                    <div className="section">
                        <FormInputText
                            name="telphone"
                            control={control}
                            label="Teléfono"
                        />
                    </div>

                    <div className="section">
                        <FormAutocompleteAsync
                            name="idTypeCli"
                            control={control}
                            label="Tipo de cliente"
                            options={typeCliOptions}
                            isLoading={isTypeCliLoading}
                            getOptionLabel={(opt: Option) => opt.label}
                            getOptionValue={(opt: Option) => opt.value}
                        />
                    </div>

                    <div className="container_button">
                        <Button
                            variant="contained"
                            type="submit"
                            sx={{ mt: 2 }}
                        >
                            Guardar
                        </Button>
                        <Button
                            variant="contained"
                            type="button"
                            sx={{ mt: 2 }}
                            color="error"
                            onClick={() => navigate(`/private/client`)}
                        >
                            Cancelar
                        </Button>
                    </div>
                </Box>
            </CardForm>
        </div>
    );
};

export default ClientCreate;
