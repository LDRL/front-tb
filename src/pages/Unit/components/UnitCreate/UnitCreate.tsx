import React, { useEffect, useState } from 'react';
import CardForm from '../../../../components/Cards/CardForm'
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoadMask from '@/components/LoadMask/LoadMask';
import { FormInputText } from '@/components';
import { Box, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { RootState } from '@/redux/store';
import { Unit } from '../../models';
import { PrivateRoutes } from '@/models';
import "./UnitCreate.css"
import { useCreateUnit, useGetUnit, useUpdateUnit } from '../../hooks/useUnit';
import { clearUnit, editUnit } from '@/redux/unitSlice';
import Loading from '@/components/Loading';
import { toast } from 'react-toastify';

const UnitCreate: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [subtitulo, setSubtitulo] = useState<string>("");
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { currentUnit } = useSelector((state: RootState) => state.unit);

  const { control, handleSubmit, reset } = useForm<Unit>({
    defaultValues: { id: 0, name: '', abbreviation: '', status: true },
  });

  const { data } = id ? useGetUnit(id) : { data: null };

  const createUnitMutation = useCreateUnit();
  const updateUnitMutation = useUpdateUnit();

  useEffect(() => {
    if (id && data) {
      dispatch(editUnit(data));
      return
    }

    dispatch(clearUnit())
  }, [dispatch, data]);

  useEffect(() => {
    if (currentUnit) {
      reset(currentUnit);
      setSubtitulo("Editar")
    } else {
      reset({ id: 0, name: '', abbreviation: '', status: true });
      setSubtitulo("Nueva")
    }
  }, [currentUnit, reset]);

  const onSubmit = async (data: Unit) => {
    setLoading(true);
    try {
      if (currentUnit) {
        await updateUnitMutation.mutateAsync(data);
        toast.success("Unidad de medida actualizada exitosamente");
      } else {
        await createUnitMutation.mutateAsync(data);
        toast.success("Unidad de medida creada exitosamente");
      }
      navigate(`/private/${PrivateRoutes.UNIT}`, { replace: true })
    } catch (error: any) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.error || "Error desconocido");
      } else {
        toast.error(error.message || "Error desconocido");
      }
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && (
        <Loading loading />
      )}

      <CardForm
        titulo='Unidad de medida'
        subtitulo={subtitulo}
      >
        <LoadMask />
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
              name="abbreviation"
              control={control}
              label="Abreviatura"
              max={5}
              rules={{ required: 'La abreviatura es requerida' }}
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
              onClick={() => navigate('/private/unit')}
            >
              Cancelar
            </Button>
          </div>
        </Box>
      </CardForm>
    </div>
  );
};

export default UnitCreate;