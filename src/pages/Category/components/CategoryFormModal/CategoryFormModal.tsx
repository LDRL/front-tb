import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery, useTheme } from '@mui/material';
import { useForm } from 'react-hook-form';
import { FormInputText } from '@/components';
import Loading from '@/components/Loading';
import { toast } from 'react-toastify';
import { getErrorMessage } from '@/utils/axiosClient';
import { Category } from '../../models';
import { useCreateCategory, useUpdateCategory } from '../../hooks/useCategory';

type Props = {
  open: boolean;
  onClose: () => void;
  category: Category | null;
};

const CategoryFormModal: React.FC<Props> = ({ open, onClose, category }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { control, handleSubmit, reset } = useForm<Category>({
    defaultValues: { id: 0, name: '' },
  });

  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();

  useEffect(() => {
    if (open) {
      reset(category ?? { id: 0, name: '' });
    }
  }, [open, category, reset]);

  const onSubmit = async (data: Category) => {
    setLoading(true);
    try {
      if (category) {
        await updateCategoryMutation.mutateAsync(data);
        toast.success('Categoría actualizada exitosamente');
      } else {
        await createCategoryMutation.mutateAsync(data);
        toast.success('Categoría creada exitosamente');
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
          {category ? 'Editar categoría' : 'Nueva categoría'}
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
              label="Nombre categoría"
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
              {category ? 'Actualizar' : 'Guardar'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default CategoryFormModal;