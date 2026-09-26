import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery, useTheme } from '@mui/material';
import { useForm } from 'react-hook-form';
import { FormInputText } from '@/components';
import Loading from '@/components/Loading';
import { toast } from 'react-toastify';
import { getErrorMessage } from '@/utils/axiosClient';
import { Brand } from '../../models';
import { useCreateBrand, useUpdateBrand } from '../../hooks/useBrand';

type Props = {
  open: boolean;
  onClose: () => void;
  brand: Brand | null;
};

const BrandFormModal: React.FC<Props> = ({ open, onClose, brand }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { control, handleSubmit, reset } = useForm<Brand>({
    defaultValues: { id: 0, name: '', status: true },
  });

  const createBrandMutation = useCreateBrand();
  const updateBrandMutation = useUpdateBrand();

  useEffect(() => {
    if (open) {
      reset(brand ?? { id: 0, name: '', status: true });
    }
  }, [open, brand, reset]);

  const onSubmit = async (data: Brand) => {
    setLoading(true);
    try {
      if (brand) {
        await updateBrandMutation.mutateAsync(data);
        toast.success('Marca actualizada exitosamente');
      } else {
        await createBrandMutation.mutateAsync(data);
        toast.success('Marca creada exitosamente');
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
          {brand ? 'Editar marca' : 'Nueva marca'}
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
              label="Nombre marca"
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
              {brand ? 'Actualizar' : 'Guardar'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default BrandFormModal;