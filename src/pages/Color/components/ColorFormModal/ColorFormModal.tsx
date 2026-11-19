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
import { Color } from '../../models';
import { useCreateColor, useUpdateColor } from '../../hooks/useColor';

type Props = {
  open: boolean;
  onClose: () => void;
  color: Color | null;
};

const ColorFormModal: React.FC<Props> = ({ open, onClose, color }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { control, handleSubmit, reset, watch, setValue } = useForm<Color>({
    defaultValues: { id: 0, name: '', hex: '#000000', status: true },
  });

  const createColorMutation = useCreateColor();
  const updateColorMutation = useUpdateColor();
  const hexValue = watch('hex');
  const isValidHex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hexValue || '');
  const pickerHex = /^#([0-9A-Fa-f]{6})$/.test(hexValue || '') ? (hexValue as string) : '#000000';

  useEffect(() => {
    if (open) {
      reset(color ?? { id: 0, name: '', hex: '#000000', status: true });
    }
  }, [open, color, reset]);

  const onSubmit = async (data: Color) => {
    setLoading(true);
    try {
      if (color) {
        await updateColorMutation.mutateAsync({ ...data, id: color.id });
        toast.success('Color actualizado exitosamente');
      } else {
        await createColorMutation.mutateAsync(data);
        toast.success('Color creado exitosamente');
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
          {color ? 'Editar color' : 'Nuevo color'}
        </DialogTitle>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <DialogContent sx={{ px: 2.5, py: 2.5, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormInputText
              name="name"
              control={control}
              label="Nombre"
              rules={{ required: 'El nombre es requerido' }}
            />

            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
              <Box sx={{ flex: 1 }}>
                <FormInputText
                  name="hex"
                  control={control}
                  label="Hex"
                  rules={{
                    required: 'El color hex es requerido',
                    pattern: {
                      value: /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/,
                      message: 'Formato hex inválido (ej. #1E40AF)',
                    },
                  }}
                />
              </Box>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  mt: 0.5,
                  borderRadius: 1,
                  border: '1px solid #ccc',
                  backgroundColor: isValidHex ? hexValue : 'transparent',
                  flexShrink: 0,
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
                title="Seleccionar color"
              >
                <input
                  type="color"
                  value={pickerHex}
                  onChange={(e) => setValue('hex', e.target.value.toUpperCase(), { shouldValidate: true, shouldDirty: true })}
                  aria-label="Seleccionar color"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer',
                    border: 'none',
                    padding: 0,
                  }}
                />
              </Box>
            </Box>
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
              {color ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default ColorFormModal;
