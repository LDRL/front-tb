import { FormDropdown } from "@/components";
import CardForm from "@/components/Cards/CardForm";
import { Box, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { dialogCloseSubject$ } from "@/components/CustomDialog/CustomDialog";
import { toast } from 'react-toastify';
import { useConvertQuote, useFetchPaymentTypes } from "../../hooks/useSale";
import { getErrorMessage } from "@/utils/axiosClient";
import { useNavigate } from "react-router-dom";
import { PrivateRoutes } from "@/models";

interface Props {
    id: string;
}

const ConfirmSale: React.FC<Props> = ({ id }) => {
    const navigate = useNavigate();

    const { control, handleSubmit } = useForm<{ idTypePay: number }>({
        defaultValues: { idTypePay: 1 },
    });

    const { data: paymentTypeOptions = [] } = useFetchPaymentTypes();

    const convertMutation = useConvertQuote();

    const handleExit = () => {
        dialogCloseSubject$.setSubject = false;
    };

    const onSubmit = async (data: { idTypePay: number }) => {
        try {
            await convertMutation.mutateAsync({ id, idTypePay: data.idTypePay });

            toast.success("Venta registrada correctamente");

            handleExit();
            navigate(`/private/${PrivateRoutes.SALE}`, { replace: true });
        } catch (error: any) {
            toast.error(getErrorMessage(error));
        }
    };

    return (
        <div className="container" style={{marginTop: '1.5rem'}}>

        
            <CardForm titulo="Confirmar venta" subtitulo="" >
                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{ marginLeft: 3 }}
                    autoComplete="off"
                >
                    <div className='section'>
                        <FormDropdown
                            name="idTypePay"
                            control={control}
                            label="Forma de pago"
                            rules={{ required: 'Forma de pago es requerido' }}
                            options={paymentTypeOptions}
                        />
                    </div>

                    <div className='container_button'>
                        <Button
                            variant="contained"
                            type="submit"
                            sx={{ mt: 2 }}
                            disabled={convertMutation.isPending}
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

export default ConfirmSale;
