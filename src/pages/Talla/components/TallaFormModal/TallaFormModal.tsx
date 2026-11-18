import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { FormInputNumber, FormInputText } from '@/components';
import Loading from '@/components/Loading';
import { toast } from 'react-toastify';
import { getErrorMessage } from '@/utils/axiosClient';
import { Talla } from '../../models';
import { useCreateTalla, useUpdateTalla } from '../../hooks/useTalla';

type Props = {
  open: boolean;
  onClose: () => void;
  talla: Talla | null;
};

const TallaFormModal: React.FC<Props> = ({ open, onClose, talla }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { control, handleSubmit, reset } = useForm<Talla>({
    defaultValues: { id: 0, name: '', type: '', order: 0, status: true },
  });

  const createTallaMutation = useCreateTalla();
  const updateTallaMutation = useUpdateTalla();

  useEffect(() => {
    if (open) {
      reset(talla ?? { id: 0, name: '', type: '', order: 0, status: true });
    }
  }, [open, talla, reset]);

  const onSubmit = async (data: Talla) => {
    setLoading(true);
    try {
      if (talla) {
        await updateTallaMutation.mutateAsync({ ...data, id: talla.id });
        toast.success('Talla actualizada exitosamente');
      } else {
        await createTallaMutation.mutateAsync(data);
        toast.success('Talla creada exitosamente');
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
          {talla ? 'Editar talla' : 'Nueva talla'}
        </DialogTitle>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <DialogContent sx={{ px: 2.5, py: 2.5, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormInputText
              name="name"
              control={control}
              label="Nombre"
              rules={{ required: 'El nombre es requerido' }}
            />

            <FormControl fullWidth size="small" error={false}>
              <InputLabel id="talla-tipo-label">Tipo</InputLabel>
              <Controller
                name="type"
                control={control}
                rules={{ required: 'El tipo es requerido' }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Select
                      {...field}
                      labelId="talla-tipo-label"
                      label="Tipo"
                      value={field.value ?? ''}
                      error={!!error}
                    >
                      <MenuItem value="ROPA">ROPA</MenuItem>
                      <MenuItem value="CALZADO">CALZADO</MenuItem>
                    </Select>
                    {error && (
                      <FormHelperText sx={{ color: 'red' }}>
                        {error.message}
                      </FormHelperText>
                    )}
                  </>
                )}
              />
            </FormControl>

            <FormInputNumber
              name="order"
              control={control}
              label="Orden"
              rules={{
                required: 'El orden es requerido',
                min: { value: 0, message: 'El orden debe ser mayor o igual a 0' },
              }}
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
              {talla ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default TallaFormModal;
