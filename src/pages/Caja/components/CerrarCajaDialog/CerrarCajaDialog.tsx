import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Loading from '@/components/Loading';
import { getErrorMessage } from '@/utils/axiosClient';
import { useCerrarCaja } from '../../hooks/useCaja';
import { Arqueo, CajaSesion } from '../../models';

type Props = {
  open: boolean;
  onClose: () => void;
  sesion: CajaSesion | null;
  arqueo?: Arqueo | null;
  onClosed?: () => void;
};

type FormValues = {
  monto_contado: number;
  observaciones: string;
};

const money = (value: number | null | undefined) => `Q ${Number(value ?? 0).toFixed(2)}`;

const CerrarCajaDialog: React.FC<Props> = ({ open, onClose, sesion, arqueo, onClosed }) => {
  const [loading, setLoading] = useState(false);
  const cerrarCaja = useCerrarCaja();
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<FormValues>({
    defaultValues: { monto_contado: 0, observaciones: '' },
  });

  const montoContado = watch('monto_contado');
  const esperado = arqueo?.expectedAmount ?? sesion?.expectedAmount ?? 0;
  const diferencia = Number(montoContado || 0) - Number(esperado || 0);

  useEffect(() => {
    if (open) {
      reset({
        monto_contado: arqueo?.expectedAmount ?? sesion?.expectedAmount ?? 0,
        observaciones: sesion?.observations ?? '',
      });
    }
  }, [open, reset, arqueo, sesion]);

  const onSubmit = async (values: FormValues) => {
    if (!sesion) return;
    setLoading(true);
    try {
      await cerrarCaja.mutateAsync({
        idsesion: sesion.id,
        payload: {
          monto_contado: Number(values.monto_contado),
          observaciones: values.observaciones || undefined,
        },
      });
      toast.success('Caja cerrada exitosamente');
      onClosed?.();
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
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ borderBottom: '2px solid #e9ebec' }}>
          Cerrar caja {sesion?.cajaName ? `- ${sesion.cajaName}` : ''}
        </DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2.5 }}>
            <Alert severity="info">
              El esperado se calcula con apertura + ventas efectivo - compras efectivo + ingresos manuales - egresos manuales.
            </Alert>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Box sx={{ flex: 1, p: 1.5, bgcolor: '#f8fafc', borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary">Monto esperado</Typography>
                <Typography fontWeight={700}>{money(esperado)}</Typography>
              </Box>
              <Box sx={{ flex: 1, p: 1.5, bgcolor: diferencia === 0 ? '#f0fdf4' : '#fff7ed', borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary">Diferencia</Typography>
                <Typography fontWeight={700} color={diferencia === 0 ? 'success.main' : 'warning.main'}>
                  {money(diferencia)}
                </Typography>
              </Box>
            </Stack>

            <TextField
              label="Monto contado"
              type="number"
              inputProps={{ min: 0, step: '0.01' }}
              fullWidth
              {...register('monto_contado', {
                required: 'El monto contado es requerido',
                min: { value: 0, message: 'Debe ser mayor o igual a 0' },
                valueAsNumber: true,
              })}
              error={!!errors.monto_contado}
              helperText={errors.monto_contado?.message}
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
              Cerrar caja
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default CerrarCajaDialog;
