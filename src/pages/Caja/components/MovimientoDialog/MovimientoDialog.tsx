import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Loading from '@/components/Loading';
import { getErrorMessage } from '@/utils/axiosClient';
import { useCrearMovimiento } from '../../hooks/useCaja';

type Props = {
  open: boolean;
  onClose: () => void;
  idsesion: number | null;
  onCreated?: () => void;
};

type FormValues = {
  tipo: 'INGRESO' | 'EGRESO';
  concepto: string;
  importe: number;
  descripcion: string;
  referencia: string;
};

const MovimientoDialog: React.FC<Props> = ({ open, onClose, idsesion, onCreated }) => {
  const [loading, setLoading] = useState(false);
  const crearMovimiento = useCrearMovimiento();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: { tipo: 'INGRESO', concepto: '', importe: 0, descripcion: '', referencia: '' },
  });

  useEffect(() => {
    if (open) reset({ tipo: 'INGRESO', concepto: '', importe: 0, descripcion: '', referencia: '' });
  }, [open, reset]);

  const onSubmit = async (values: FormValues) => {
    if (!idsesion) return;
    setLoading(true);
    try {
      await crearMovimiento.mutateAsync({
        idsesion,
        payload: {
          tipo: values.tipo,
          concepto: values.concepto,
          importe: Number(values.importe),
          descripcion: values.descripcion || undefined,
          referencia: values.referencia || undefined,
        },
      });
      toast.success('Movimiento registrado exitosamente');
      onCreated?.();
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
        <DialogTitle sx={{ borderBottom: '2px solid #e9ebec' }}>Registrar movimiento</DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2.5 }}>
            <TextField
              select
              label="Tipo"
              fullWidth
              defaultValue="INGRESO"
              {...register('tipo', { required: 'El tipo es requerido' })}
              error={!!errors.tipo}
              helperText={errors.tipo?.message}
            >
              <MenuItem value="INGRESO">Ingreso</MenuItem>
              <MenuItem value="EGRESO">Egreso</MenuItem>
            </TextField>

            <TextField
              label="Concepto"
              fullWidth
              {...register('concepto', { required: 'El concepto es requerido' })}
              error={!!errors.concepto}
              helperText={errors.concepto?.message}
            />

            <TextField
              label="Importe"
              type="number"
              inputProps={{ min: 0.01, step: '0.01' }}
              fullWidth
              {...register('importe', {
                required: 'El importe es requerido',
                min: { value: 0.01, message: 'El importe debe ser mayor a 0' },
                valueAsNumber: true,
              })}
              error={!!errors.importe}
              helperText={errors.importe?.message}
            />

            <TextField label="Descripción" fullWidth multiline minRows={2} {...register('descripcion')} />
            <TextField label="Referencia" fullWidth {...register('referencia')} />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button variant="contained" color="error" onClick={onClose} sx={{ borderRadius: 5 }}>
              Cancelar
            </Button>
            <Button variant="contained" type="submit" sx={{ borderRadius: 5 }}>
              Guardar
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default MovimientoDialog;
