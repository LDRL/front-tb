import { FormDropdown, FormInputText } from "@/components";
import CardForm from "@/components/Cards/CardForm";
import { Box, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { dialogCloseSubject$ } from "@/components/CustomDialog/CustomDialog";
import { useMutation } from "@tanstack/react-query";
import { toast } from 'react-toastify';
import { createClient } from "../../services/client";
import { useDispatch } from "react-redux";
import { editClient } from "@/redux/clientSlice";
import { ClientForm } from "@/pages/Client/models";
import { useFetchTypeClientsOptions } from "@/hooks/useOption";
import Loading from "@/components/Loading";

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


        mutation.mutate(data, {
            onSuccess: (response) => {

                const createdClient = response;

                toast.success("Cliente creado exitosamente");

                // 🔥 SOLO UN DISPATCH
                dispatch(editClient(createdClient));

                dialogCloseSubject$.setSubject = false;
            }
        });
    };

    return (
        <div className="container">
            <CardForm titulo="Cliente" subtitulo="Nuevo">
                <Loading loading={mutation.isPending} />
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