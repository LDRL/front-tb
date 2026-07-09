import { FormDropdown, FormInputText } from "@/components";
import CardForm from "@/components/Cards/CardForm";
import LoadMask from '@/components/LoadMask/LoadMask';
import { Box, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { dialogCloseSubject$ } from "@/components/CustomDialog/CustomDialog";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from 'react-toastify';
import { createClient } from "../../services/client";
import { useDispatch } from "react-redux";
import { editClient } from "@/redux/clientSlice";
import { ClientForm } from "@/pages/Client/models";
import { useFetchTypeClientsOptions } from "@/hooks/useOption";

const ClientCreate: React.FC = () => {
    const dispatch = useDispatch();

    const { control, handleSubmit } = useForm<ClientForm>({
        defaultValues: {
            name: '',
            lastName: '',
            address: '',
            email: '',
            telphone: '',
            nit: '',
            idTypeCli: ''
        },
    });

    const [loading, setLoading] = useState(false);
    const {data: typeCliOptions} =   useFetchTypeClientsOptions();
    

    const mutation = useMutation({
        mutationFn: (data: ClientForm) => createClient(data),
        onError: (error: any) => {
            if (error.response?.data) {
                toast.error(error.response.data.error || "Error desconocido");
            } else {
                toast.error(error.message || "Error desconocido");
            }
        },
    });

    const handleExit = () => {
        dialogCloseSubject$.setSubject = false;
    };

    const onSubmit = async (data: ClientForm) => {
        setLoading(true);

        mutation.mutate(data, {
            onSuccess: (response) => {
                setLoading(false);

                const createdClient = response;

                toast.success("Cliente creado exitosamente");

                // 🔥 SOLO UN DISPATCH
                dispatch(editClient(createdClient));

                dialogCloseSubject$.setSubject = false;
            },
            onSettled: () => {
                setLoading(false);
            }
        });
    };

    return (
        <div className="container">
            <CardForm titulo="Cliente" subtitulo="Nuevo">
                <LoadMask />
                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{ marginLeft: 3 }}
                    autoComplete="off"
                >
                    <div className='section'>
                        <FormInputText
                            name="nit"
                            control={control}
                            label="Nit"
                            rules={{ required: 'Nit es requerido' }}
                        />
                    </div>

                    <div className='section'>
                        <FormInputText
                            name="name"
                            control={control}
                            label="Nombres"
                            rules={{ required: 'Nombres es requerido' }}
                        />
                    </div>

                    <div className='section'>
                        <FormInputText
                            name="lastName"
                            control={control}
                            label="Apellidos"
                            rules={{ required: 'Apellidos es requerido' }}
                        />
                    </div>

                    <div className='section'>
                        <FormInputText
                            name="address"
                            control={control}
                            label="Dirección"
                            rules={{ required: 'dirección es requerido' }}
                        />
                    </div>

                    <div className='section'>
                        <FormInputText
                            name="email"
                            control={control}
                            label="Correo electrónico"
                        />
                    </div>

                    <div className='section'>
                        <FormInputText
                            name="telphone"
                            control={control}
                            label="Teléfono"
                        />
                    </div>

                    <div className="section">
                        <FormDropdown
                            name="idTypeCli"
                            control={control}                            
                            label="Tipo de cliente"
                            rules={{ required: 'Tipo cliente un campo requerido' }}
                            options={typeCliOptions || []}
                        />
                    </div>

                    <div className='container_button'>
                        <Button
                            variant="contained"
                            type="submit"
                            sx={{ mt: 2 }}
                            disabled={mutation.isPending}
                        >
                            Guardar
                        </Button>

                        <Button
                            variant="contained"
                            type="button"
                            sx={{ mt: 2 }}
                            color='error'
                            onClick={handleExit}
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