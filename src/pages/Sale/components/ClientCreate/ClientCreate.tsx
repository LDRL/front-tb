import { FormInputText } from "@/components";
import CardForm from "@/components/Cards/CardForm";
import LoadMask from '@/components/LoadMask/LoadMask';
import { Box, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { Client } from "../../models";
import { dialogCloseSubject$ } from "@/components/CustomDialog/CustomDialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify'; 
import { createClient } from "../../services/client";
import { useDispatch } from "react-redux";
import { setFullNameClient, setNitClient } from "@/redux/clientSlice";



const ClientCreate: React.FC = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    const { control, handleSubmit} = useForm<Client>({
    defaultValues: { id: 0, name: '', lastName: '', email:'', telphone:''},
    });

    const [loading, setLoading] = useState(false);

    const mutation = useMutation({
        mutationFn: (data: Client) => createClient(data),
        onSuccess() {
            toast.success("Datos enviados correctamente");
        },
        onError() {
            toast.error("Error al enviar datos");
        }
    })

    const handleExit = () => {
        dialogCloseSubject$.setSubject = false;
    };

    const onSubmit = async (data: Client) => {
        const fullName = `${data.name} ${data.lastName}`
    
        setLoading(true);
        console.log(data);
        mutation.mutate(data, {
            onSettled: () => {
                setLoading(false)
                dispatch(setNitClient(data.nit));
                dispatch(setFullNameClient(fullName));
                dialogCloseSubject$.setSubject = false;
            }
        });
        

    };

    return (
        <div className="container">
            <CardForm
                titulo="Cliente"
                subtitulo="Nuevo"
            >
                <LoadMask />
                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{marginLeft:3}}
                    autoComplete="off"
                >
                    <div className='section'>
                        <FormInputText
                            name="nit"
                            control={control}
                            label="Nit"
                            rules={{ required: 'Nit es un campo requerido' }}
                        />
                    </div>

                    <div className='section'>
                        <FormInputText
                            name="name"
                            control={control}
                            label="Nombres"
                            rules={{ required: 'Nombres es un campo requerido' }}
                        />
                    </div>

                    <div className='section'>
                        <FormInputText
                            name="lastName"
                            control={control}
                            label="Apellidos"
                            rules={{ required: 'Apellidos es un campo requerido' }}
                        />
                    </div>

                    <div className='section'>
                        <FormInputText
                            name="email"
                            control={control}
                            label="Correo electronico"
                        />
                    </div>

                    <div className='section'>
                        <FormInputText
                            name="telphone"
                            control={control}
                            label="Telefono"
                        />
                    </div>

                    <div className='container_button'>
                        <Button
                            variant="contained"
                            type="submit"
                            sx={{ mt: 2 }}
                            disabled={mutation.isPending}
                        // disabled={createSaleMutation.isPending}
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
    ) 
}

export default ClientCreate;