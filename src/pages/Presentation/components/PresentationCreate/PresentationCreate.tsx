import React, { CSSProperties, useEffect, useState } from 'react';
import CardForm from '../../../../components/Cards/CardForm'
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoadMask from '@/components/LoadMask/LoadMask';
import { FormInputText } from '@/components';
import { Box, Button} from '@mui/material';
import { useForm } from 'react-hook-form';
import { RootState } from '@/redux/store';
import { Presentation } from '../../models';
import { PrivateRoutes } from '@/models';
import { ClipLoader } from 'react-spinners';
import { useCreatePresentation, useGetPresentation, useUpdatePresentation } from '../../hooks/usePresentation';
import { clearPresentation, editPresentation } from '@/redux/presentationSlice';


import "./PresentationCreate.css"


const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const PresentationCreate: React.FC = () => {
  const [loading , setLoading] = useState<boolean>(false);
  const [subtitulo, setSubtitulo] = useState<string>("");
  const [color] = useState("#ffffff")
  const navigate = useNavigate();

  const {id} = useParams<{id: string}>(); //Se captura el id de un producto
  const dispatch = useDispatch();
  const { currentPresentation } = useSelector((state: RootState) => state.presentation);

  const { control, handleSubmit, reset} = useForm<Presentation>({
    defaultValues: { id: 0, name: ''},
  });


 // Llamar al hook aquí
 const { data, isLoading, isError } = id ? useGetPresentation(id) : { data: null, isLoading: false, isError: false };

 const createPresentationMutation = useCreatePresentation();
 const updatePresentationMutation = useUpdatePresentation();

 useEffect(() => {
  if (id && data) {
    dispatch(editPresentation(data));
    return
  }

  dispatch(clearPresentation())
 }, [dispatch, data]); // Agregar 'data' e 'isError' a las dependencias


  useEffect(() => {
    if (currentPresentation) {
      reset(currentPresentation);
      setSubtitulo("Editar")
    } else {
      reset({ id: 0, name: ''});
      setSubtitulo("Nuevo")
    }
  }, [currentPresentation, reset]);


  const onSubmit = async (data: Presentation) => {
    setLoading(true);
    try {
      if (currentPresentation) {
        await updatePresentationMutation.mutateAsync(data);
      } else { // Create a new Presentation
        await createPresentationMutation.mutateAsync(data);
      }
      navigate(`/private/${PrivateRoutes.PRESENTATION}`, {replace:true})
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
        titulo='Presentación'
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
              onClick={() => navigate('/private/presentation')}
            >
              Cancelar
            </Button>
          </div>
        </Box>
      </CardForm>
    </div>
  );
};

export default PresentationCreate;