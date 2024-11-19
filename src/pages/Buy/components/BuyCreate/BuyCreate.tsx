import React, { CSSProperties, useEffect, useState } from 'react';
import CardForm from '../../../../components/Cards/CardForm'
import { useNavigate } from 'react-router-dom';
import LoadMask from '@/components/LoadMask/LoadMask';
import { FormInputText } from '@/components';
import { Box, Button} from '@mui/material';
import { useForm } from 'react-hook-form';
import { PrivateRoutes } from '@/models';
import { ClipLoader } from 'react-spinners';
import "./BuyCreate.css"
import {useCreateBuy} from '../../hooks/useBuy'
import { Buy } from '../../models';

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};


const BuyCreate: React.FC = () => {
  const [loading , setLoading] = useState<boolean>(false);
  const [subtitulo, setSubtitulo] = useState<string>("");
  const [color] = useState("#ffffff")
  const navigate = useNavigate();

  const { control, handleSubmit, reset} = useForm<Buy>({
    defaultValues: { id: 0, direction: ''},
  });
  const createBrandMutation = useCreateBuy();
  
  useEffect(() => {
    reset({ id: 0, direction: ''});
    setSubtitulo("Nuevo")    
  }, []);

  const onSubmit = async (data: Buy) => {
    setLoading(true);
    try {
      await createBrandMutation.mutateAsync(data);
      navigate(`/private/${PrivateRoutes.BRAND}`, {replace:true})
    } catch (error) {
      console.log(error)
    }
    finally {
      setLoading(false); // Desactiva el loader
    }
  };

  return (    
    <div className='container'>
      {loading && (
        <div className="sweet-loading">
          <ClipLoader
            color={color}
            loading={loading}
            cssOverride={override}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}

      <CardForm
        titulo='Compra'
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
              label="Direccion"
              rules={{ required: 'Product name is required' }}
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
              onClick={() => navigate('/private/brand')}
            >
              Cancelar
            </Button>
          </div>
        </Box>
      </CardForm>
    </div>
  );
};

export default BuyCreate;