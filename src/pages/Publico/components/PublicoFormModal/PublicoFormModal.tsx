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
import { FormInputText } from '@/components';
import Loading from '@/components/Loading';
import { toast } from 'react-toastify';
import { getErrorMessage } from '@/utils/axiosClient';
import { Publico } from '../../models';
import { useCreatePublico, useUpdatePublico } from '../../hooks/usePublico';

type Props = {
  open: boolean;
  onClose: () => void;
  publico: Publico | null;
};

const PublicoFormModal: React.FC<Props> = ({ open, onClose, publico }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { control, handleSubmit, reset } = useForm<Publico>({
    defaultValues: { id: 0, name: '', status: true },
  });

  const createPublicoMutation = useCreatePublico();
  const updatePublicoMutation = useUpdatePublico();

  useEffect(() => {
    if (open) {
      reset(publico ?? { id: 0, name: '', status: true });
    }
  }, [open, publico, reset]);

  const onSubmit = async (data: Publico) => {
    setLoading(true);
    try {
      if (publico) {
        await updatePublicoMutation.mutateAsync({ ...data, id: publico.id });
        toast.success('Público actualizado exitosamente');
      } else {
        await createPublicoMutation.mutateAsync(data);
        toast.success('Público creado exitosamente');
      }
      onClose();
    } catch (error: unknown) {
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
          {publico ? 'Editar público' : 'Nuevo público'}
        </DialogTitle>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <DialogContent sx={{ px: 2.5, py: 2.5, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormInputText
              name="name"
              control={control}
              label="Nombre"
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
              {publico ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default PublicoFormModal;
