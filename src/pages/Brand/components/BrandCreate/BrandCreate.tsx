import React, { CSSProperties, useEffect, useState } from 'react';
import CardForm from '../../../../components/Cards/CardForm'
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoadMask from '@/components/LoadMask/LoadMask';
import { FormInputText } from '@/components';
import { Box, Button} from '@mui/material';
import { useForm } from 'react-hook-form';
import { RootState } from '@/redux/store';
import { Brand } from '../../models';
import { PrivateRoutes } from '@/models';
import { ClipLoader } from 'react-spinners';
import "./BrandCreate.css"
import { useCreateBrand, useGetBrand, useUpdateBrand } from '../../hooks/useBrand';
import { clearBrand, editBrand } from '@/redux/brandSlice';


const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const BrandCreate: React.FC = () => {
  const [loading , setLoading] = useState<boolean>(false);
  const [subtitulo, setSubtitulo] = useState<string>("");
  const [color] = useState("#ffffff")
  const navigate = useNavigate();

  const {id} = useParams<{id: string}>(); //Se captura el id de un producto
  const dispatch = useDispatch();
  const { currentBrand } = useSelector((state: RootState) => state.brand);

  const { control, handleSubmit, reset} = useForm<Brand>({
    defaultValues: { id: 0, name: ''},
  });


 // Llamar al hook aquí
 const { data, isLoading, isError } = id ? useGetBrand(id) : { data: null, isLoading: false, isError: false };

console.log(id, data, "///////")
 const createBrandMutation = useCreateBrand();
 const updateBrandMutation = useUpdateBrand();

 useEffect(() => {
  if (id && data) {
    dispatch(editBrand(data));
    return
  }

  dispatch(clearBrand())
 }, [dispatch, data]); // Agregar 'data' e 'isError' a las dependencias


  useEffect(() => {
    if (currentBrand) {
      reset(currentBrand);
      setSubtitulo("Editar")
    } else {
      reset({ id: 0, name: ''});
      setSubtitulo("Nuevo")
    }
  }, [currentBrand, reset]);


  const onSubmit = async (data: Brand) => {
    setLoading(true);
    try {
      if (currentBrand) {
        await updateBrandMutation.mutateAsync(data);
      } else { // Create a new Brand
        await createBrandMutation.mutateAsync(data);
      }
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
        titulo='Marca'
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
              label="Nombre categoría"
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

export default BrandCreate;