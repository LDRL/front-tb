import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery, useTheme } from '@mui/material';
import { useForm } from 'react-hook-form';
import { FormInputText } from '@/components';
import Loading from '@/components/Loading';
import { toast } from 'react-toastify';
import { getErrorMessage } from '@/utils/axiosClient';
import { Presentation } from '../../models';
import { useCreatePresentation, useUpdatePresentation } from '../../hooks/usePresentation';

type Props = {
  open: boolean;
  onClose: () => void;
  presentation: Presentation | null;
};

const PresentationFormModal: React.FC<Props> = ({ open, onClose, presentation }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { control, handleSubmit, reset } = useForm<Presentation>({
    defaultValues: { id: 0, name: '', status: true },
  });

  const createPresentationMutation = useCreatePresentation();
  const updatePresentationMutation = useUpdatePresentation();

  useEffect(() => {
    if (open) {
      reset(presentation ?? { id: 0, name: '', status: true });
    }
  }, [open, presentation, reset]);

  const onSubmit = async (data: Presentation) => {
    setLoading(true);
    try {
      if (presentation) {
        await updatePresentationMutation.mutateAsync(data);
        toast.success('Presentación actualizada exitosamente');
      } else {
        await createPresentationMutation.mutateAsync(data);
        toast.success('Presentación creada exitosamente');
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
        <DialogTitle sx={{
          borderBottom: '2px solid #e9ebec'
        }}>
          {presentation ? 'Editar presentación' : 'Nueva presentación'}
        </DialogTitle>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
        >
          <DialogContent sx={{ px: 2.5, py: 2.5, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormInputText
              name="name"
              control={control}
              label="Nombre presentación"
              rules={{ required: 'El nombre es requerido' }}
            />
          </DialogContent>

          <DialogActions
            sx={{
              px: 2.5,
              pb: 2
            }}
          >
            <Button
              variant="contained"
              color="error"
              type="button"
              onClick={onClose}
              sx={{
                borderRadius: 5,
                fontSize: isMobile ? '0.7rem' : '0.875rem',
                minHeight: isMobile ? '12px' : 'auto',
                py: isMobile ? 0.8 : 1
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
                py: isMobile ? 0.8 : 1
              }}
            >
              {presentation ? 'Actualizar' : 'Guardar'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default PresentationFormModal;