import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useForm } from 'react-hook-form';
import { FormInputText } from '@/components';
import Loading from '@/components/Loading';
import { toast } from 'react-toastify';
import { getErrorMessage } from '@/utils/axiosClient';
import { Unit } from '../../models';
import { useCreateUnit, useUpdateUnit } from '../../hooks/useUnit';

type Props = {
  open: boolean;
  onClose: () => void;
  unit: Unit | null;
};

const UnitFormModal: React.FC<Props> = ({ open, onClose, unit }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const { control, handleSubmit, reset } = useForm<Unit>({
    defaultValues: { id: 0, name: '', abbreviation: '', status: true },
  });

  const createUnitMutation = useCreateUnit();
  const updateUnitMutation = useUpdateUnit();

  useEffect(() => {
    if (open) {
      reset(unit ?? { id: 0, name: '', abbreviation: '', status: true });
    }
  }, [open, unit, reset]);

  const onSubmit = async (data: Unit) => {
    setLoading(true);
    try {
      if (unit) {
        await updateUnitMutation.mutateAsync(data);
        toast.success('Unidad de medida actualizada exitosamente');
      } else {
        await createUnitMutation.mutateAsync(data);
        toast.success('Unidad de medida creada exitosamente');
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
          {unit ? 'Editar unidad de medida' : 'Nueva unidad de medida'}
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
              label="Nombre"
              labelOutside
              rules={{ required: 'El nombre es requerido' }}
            />

            <FormInputText
              name="abbreviation"
              control={control}
              label="Abreviatura"
              labelOutside
              rules={{ required: 'La abreviatura es requerida' }}
              />
          </DialogContent>

          <DialogActions sx={{ px: 3 }}>
            <Button variant="contained" color="error" type="button" onClick={onClose}>
              Cerrar
            </Button>
            <Button variant="contained" type="submit">
              Actualizar Unidad
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default UnitFormModal;