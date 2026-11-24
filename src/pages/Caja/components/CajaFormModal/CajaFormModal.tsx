import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FormInputText } from '@/components';
import Loading from '@/components/Loading';
import { getErrorMessage } from '@/utils/axiosClient';
import { Caja } from '../../models';
import { useCreateCaja, useUpdateCaja } from '../../hooks/useCaja';

type Props = {
  open: boolean;
  onClose: () => void;
  caja: Caja | null;
};

type FormValues = {
  name: string;
};

const CajaFormModal: React.FC<Props> = ({ open, onClose, caja }) => {
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const createCaja = useCreateCaja();
  const updateCaja = useUpdateCaja();

  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: { name: '' },
  });

  useEffect(() => {
    if (open) {
      reset({ name: caja?.name ?? '' });
    }
  }, [open, caja, reset]);

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      if (caja) {
        await updateCaja.mutateAsync({ id: caja.id, payload: { nombre: values.name } });
        toast.success('Caja actualizada exitosamente');
      } else {
        await createCaja.mutateAsync({ nombre: values.name });
        toast.success('Caja creada exitosamente');
      }
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loading loading />}
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
        <DialogTitle sx={{ borderBottom: '2px solid #e9ebec' }}>
          {caja ? 'Editar caja' : 'Nueva caja'}
        </DialogTitle>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <DialogContent sx={{ px: 2.5, py: 2.5, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormInputText
              name="name"
              control={control}
              label="Nombre de caja"
              rules={{ required: 'El nombre es requerido' }}
            />
          </DialogContent>

          <DialogActions sx={{ px: 2.5, pb: 2 }}>
            <Button
              variant="contained"
              color="error"
              type="button"
              onClick={onClose}
              sx={{
                borderRadius: 5,
                fontSize: isMobile ? '0.7rem' : '0.875rem',
                minHeight: isMobile ? '12px' : 'auto',
                py: isMobile ? 0.8 : 1,
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              type="submit"
              sx={{
                borderRadius: 5,
                fontSize: isMobile ? '0.7rem' : '0.875rem',
                minHeight: isMobile ? '12px' : 'auto',
                py: isMobile ? 0.8 : 1,
              }}
            >
              {caja ? 'Actualizar' : 'Guardar'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default CajaFormModal;
