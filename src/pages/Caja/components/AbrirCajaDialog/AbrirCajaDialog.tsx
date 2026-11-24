import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Loading from '@/components/Loading';
import { getErrorMessage } from '@/utils/axiosClient';
import { useAbrirCaja } from '../../hooks/useCaja';
import { Caja } from '../../models';

type Props = {
  open: boolean;
  onClose: () => void;
  caja: Caja | null;
  onOpened?: () => void;
};

type FormValues = {
  monto_apertura: number;
  observaciones: string;
};

const AbrirCajaDialog: React.FC<Props> = ({ open, onClose, caja, onOpened }) => {
  const [loading, setLoading] = useState(false);
  const abrirCaja = useAbrirCaja();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: { monto_apertura: 0, observaciones: '' },
  });

  useEffect(() => {
    if (open) reset({ monto_apertura: 0, observaciones: '' });
  }, [open, reset]);

  const onSubmit = async (values: FormValues) => {
    if (!caja) return;
    setLoading(true);
    try {
      await abrirCaja.mutateAsync({
        idcaja: caja.id,
        payload: {
          monto_apertura: Number(values.monto_apertura),
          observaciones: values.observaciones || undefined,
        },
      });
      toast.success('Caja abierta exitosamente');
      onOpened?.();
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
          Abrir caja {caja ? `- ${caja.name}` : ''}
        </DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2.5 }}>
            <TextField
              label="Monto de apertura"
              type="number"
              inputProps={{ min: 0, step: '0.01' }}
              fullWidth
              {...register('monto_apertura', {
                required: 'El monto de apertura es requerido',
                min: { value: 0, message: 'Debe ser mayor o igual a 0' },
                valueAsNumber: true,
              })}
              error={!!errors.monto_apertura}
              helperText={errors.monto_apertura?.message}
            />
            <TextField
              label="Observaciones"
              fullWidth
              multiline
              minRows={2}
              {...register('observaciones')}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button variant="contained" color="error" onClick={onClose} sx={{ borderRadius: 5 }}>
              Cancelar
            </Button>
            <Button variant="contained" type="submit" sx={{ borderRadius: 5 }}>
              Abrir caja
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default AbrirCajaDialog;
