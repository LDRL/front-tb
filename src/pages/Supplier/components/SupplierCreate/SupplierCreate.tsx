import React, { useEffect, useState } from 'react';
import CardForm from '../../../../components/Cards/CardForm'
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoadMask from '@/components/LoadMask/LoadMask';
import { FormInputText } from '@/components';
import { Box, Button} from '@mui/material';
import { useForm } from 'react-hook-form';
import { RootState } from '@/redux/store';
import { PrivateRoutes } from '@/models';
import { useCreateSupplier, useGetSupplier, useUpdateSupplier } from '../../hooks/useSupplier';
import { clearSupplier, editSupplier } from '@/redux/supplierSlice';
import { toast } from 'react-toastify';

import "./SupplierCreate.css"
import Loading from '@/components/Loading';
import { SupplierForm } from '../../models/supplier.view.type';

const SupplierCreate: React.FC = () => {
  const [loading , setLoading] = useState<boolean>(false);
  const [subtitulo, setSubtitulo] = useState<string>("");
  const navigate = useNavigate();

  const {id} = useParams<{id: string}>(); //capturar el id
  const dispatch = useDispatch();
  const { currentSupplier } = useSelector((state: RootState) => state.supplier);

  const { control, handleSubmit, reset} = useForm<SupplierForm>({
    defaultValues: { code: 0, name: ''},
  });

 // Llamar al hook aquí
 const { data, isLoading, isError } = id ? useGetSupplier(id) : { data: null, isLoading: false, isError: false };

 const createSupplierMutation = useCreateSupplier();
 const updateSupplierMutation = useUpdateSupplier();

 useEffect(() => {
  if (id && data) {
    dispatch(editSupplier(data));
    return
  }

  dispatch(clearSupplier())
 }, [dispatch, data]); // Agregar 'data' e 'isError' a las dependencias

  useEffect(() => {
    if (currentSupplier) {
      reset(currentSupplier);
      setSubtitulo("Editar")
    } else {
      reset({ code: 0, name: ''});
      setSubtitulo("Nuevo")
    }
  }, [currentSupplier, reset]);

  const onSubmit = async (data: SupplierForm) => {
    setLoading(true);
    try {
      if (currentSupplier) {
        //await updateSupplierMutation.mutateAsync(data);

        await updateSupplierMutation.mutateAsync({
          code: currentSupplier.code,
          data,
        });

        toast.success("Proveedor actualizado exitosamente");
      } else { // Create a new Supplier
        await createSupplierMutation.mutateAsync(data);
        toast.success("Proveedor creado exitosamente")
      }
      navigate(`/private/${PrivateRoutes.SUPPLIER}`, {replace:true})
    } catch (error: any) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.error || "Error desconocido");
      } else {
        toast.error(error.message || "Error desconocido");
      }
    }
    finally {
      setLoading(false); // Desactiva el loader
    }
  };

  return (    
    <div className='container'>
      {loading && (
        <Loading loading/>
      )}

      <CardForm
        titulo='Proveedor'
        subtitulo={subtitulo}
      >
        <LoadMask/>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
        >
          <div className='section'>
            <FormInputText
              name="name"
              control={control}
              label="Nombre"
              rules={{ required: 'El nombre es requerido' }}
            />
          </div>
          <div className='section'>
            <FormInputText
              name="address"
              control={control}
              label="Direccionón"
              rules={{ required: 'la dirección es requerida' }}
            />
          </div>
          <div className='section'>
            <FormInputText
              name="phone"
              control={control}
              label="Telefono"
              rules={{ required: 'El telefono es requerido' }}
              max={8}
            />
          </div>
          <div className='section'>
            <FormInputText
                name="mail"
                control={control}
                label="Correo Electronico"
                rules={{ required: 'El correo electronico es requerido' }}
            />
          </div>
          <div className='section'>
            <FormInputText
                name="nit"
                control={control}
                label="Nit"
                rules={{ required: 'Nit requerido' }}
            />
          </div>
          <div className='container_button'>
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
              color='error'
              onClick={() => navigate('/private/proveedor')}
            >
              Cancelar
            </Button>
          </div>
        </Box>
      </CardForm>
    </div>
  );
};

export default SupplierCreate;