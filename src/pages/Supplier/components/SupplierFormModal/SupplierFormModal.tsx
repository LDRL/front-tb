import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery, useTheme } from '@mui/material';
import { useForm } from 'react-hook-form';
import { FormInputText } from '@/components';
import Loading from '@/components/Loading';
import { toast } from 'react-toastify';
import { getErrorMessage } from '@/utils/axiosClient';
import { Supplier } from '../../models/supplier.domain.type';
import { SupplierForm } from '../../models/supplier.view.type';
import { useCreateSupplier, useUpdateSupplier } from '../../hooks/useSupplier';

type Props = {
  open: boolean;
  onClose: () => void;
  supplier: Supplier | null;
};

const defaultValues: SupplierForm = {
  code: 0,
  name: '',
  address: '',
  phone: 0,
  mail: '',
  state: true,
  nit: '',
};

const SupplierFormModal: React.FC<Props> = ({ open, onClose, supplier }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { control, handleSubmit, reset } = useForm<SupplierForm>({
    defaultValues,
  });

  const createSupplierMutation = useCreateSupplier();
  const updateSupplierMutation = useUpdateSupplier();

  useEffect(() => {
    if (open) {
      reset(
        supplier
          ? {
              code: supplier.code ?? 0,
              name: supplier.name,
              address: supplier.address,
              phone: supplier.phone,
              mail: supplier.mail,
              state: supplier.state ?? true,
              nit: supplier.nit,
            }
          : defaultValues
      );
    }
  }, [open, supplier, reset]);

  const onSubmit = async (data: SupplierForm) => {
    setLoading(true);
    try {
      if (supplier) {
        await updateSupplierMutation.mutateAsync({ code: supplier.code, data });
        toast.success('Proveedor actualizado exitosamente');
      } else {
        await createSupplierMutation.mutateAsync(data);
        toast.success('Proveedor creado exitosamente');
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

      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{
          borderBottom: '2px solid #e9ebec'
        }}>
          {supplier ? 'Editar proveedor' : 'Nuevo proveedor'}
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
              rules={{ required: 'El nombre es requerido' }}
            />

            <FormInputText
              name="address"
              control={control}
              label="Dirección"
              rules={{ required: 'la dirección es requerida' }}
            />

            <FormInputText
              name="phone"
              control={control}
              label="Telefono"
              rules={{ required: 'El telefono es requerido' }}
              max={8}
            />

            <FormInputText
              name="mail"
              control={control}
              label="Correo Electronico"
              rules={{ required: 'El correo electronico es requerido' }}
            />

            <FormInputText
              name="nit"
              control={control}
              label="Nit"
              rules={{ required: 'Nit requerido' }}
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
              {supplier ? 'Actualizar' : 'Guardar'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default SupplierFormModal;