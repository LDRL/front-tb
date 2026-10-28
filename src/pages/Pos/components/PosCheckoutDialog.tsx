import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { FormDropdown, FormInputText } from '@/components';
import { useDispatch, useSelector } from 'react-redux';
import { useClientSearch, useFetchPaymentTypes } from '@/pages/Sale/hooks/useSale';
import { useFetchTypeClientsOptions } from '@/hooks/useOption';
import { editClient, setSearchNit, clearClient } from '@/redux/clientSlice';
import { dialogOpenSubject$ } from '@/components/CustomDialog/CustomDialog';
import { ClientCreate } from '@/pages/Sale/components/ClientCreate';
import { CustomDialog } from '@/components';
import { toast } from 'react-toastify';
import { getErrorMessage } from '@/utils/axiosClient';
import { Sale } from '@/pages/Sale/models/sale.domain.type';
import dayjs from 'dayjs';
import { PosCartItem } from '../models/pos.types';
import { useCreateSale as useCreateSaleHook } from '@/pages/Sale/hooks/useSale';
import { generateTicket } from '@/pages/Sale/components/SaleShow/saleTicket';
import { useSelector as useAppSelector } from 'react-redux';
import { AppStore } from '@/redux/store';
import { HeaderSale } from '@/pages/Sale/models/sale.view.type';

interface PosCheckoutDialogProps {
  open: boolean;
  onClose: () => void;
  items: PosCartItem[];
  total: number;
  onSuccess: () => void;
}

  interface CheckoutForm {
    nit: string;
    name: string;
    address: string;
    idTypeCli: number;
    idTypePay: number;
    isQuote: boolean;
  }

  const PosCheckoutDialog: React.FC<PosCheckoutDialogProps> = ({ open, onClose, items, total, onSuccess }) => {
    const dispatch = useDispatch();
    const createSaleMutation = useCreateSaleHook();
    const { control, handleSubmit, setValue, getValues } = useForm<CheckoutForm>({
      defaultValues: { nit: '', name: '', address: '', idTypeCli: 1, idTypePay: 1, isQuote: false }
    });
  const { data: paymentTypeOptions = [] } = useFetchPaymentTypes();
  const { data: clientTypeOptions = [] } = useFetchTypeClientsOptions();
  const { client } = useClientSearch();
  const currentClient = useSelector((state: any) => state.client.currentClient);
  const company = useAppSelector((state: AppStore) => state.auth.user.company);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    dispatch(clearClient());
    dispatch(setSearchNit(''));
    setValue('nit', '');
    setValue('name', '');
    setValue('address', '');
    setValue('idTypeCli', 1);
    setValue('idTypePay', 1);
    setValue('isQuote', false);
  }, [open, dispatch, setValue]);

  useEffect(() => {
    if (!currentClient) return;
    setValue('nit', currentClient.nit ?? '');
    setValue('name', `${currentClient.name ?? ''} ${currentClient.lastName ?? ''}`.trim());
    setValue('address', currentClient.direccion ?? '');
    if (currentClient.idTypeCli) {
      setValue('idTypeCli', currentClient.idTypeCli);
    }
  }, [currentClient, setValue]);

  useEffect(() => {
    if (!client) return;
    setValue('nit', client.nit ?? '');
    setValue('name', `${client.name ?? ''} ${client.lastName ?? ''}`.trim());
    setValue('address', client.direccion ?? '');
    if (client.idTypeCli) {
      setValue('idTypeCli', client.idTypeCli);
    }
  }, [client, setValue]);

  const searchClient = () => {
    const nit = getValues('nit')?.trim();
    if (!nit) {
      toast.error('Ingrese un NIT');
      return;
    }
    dispatch(editClient(null));
    dispatch(setSearchNit(nit));
  };

  const showModal = () => {
    dialogOpenSubject$.setSubject = true;
  };

  const onSubmit = async (data: CheckoutForm) => {
    if (items.length === 0) {
      toast.error('No hay productos en el carrito');
      return;
    }

    setLoading(true);

    try {
      const details = items.map((item) => ({
        codProductPresentation: item.codProductPresentation,
        amount: item.amount,
        cost: item.price,
        subtotal: item.subtotal,
        name: item.name
      }));

      const newData: Sale = {
        id: 0,
        name: data.name || 'Consumidor Final',
        date: dayjs().toISOString(),
        address: data.address || '',
        idClient: currentClient?.id ?? 0,
        idSucursal: 0,
        idUser: '',
        total: Number(total.toFixed(2)),
        isQuote: false,
        idTypePay: data.idTypePay,
        client: currentClient ?? {
          id: 0,
          nit: data.nit || '',
          name: data.name || '',
          lastName: '',
          direccion: data.address || '',
          email: '',
          telefono: '',
          estado: 1
        },
        typeOfSale: { id: 0, name: '' },
        idTypeCli: data.idTypeCli,
        details: details as any
      };

      const response: any = await createSaleMutation.mutateAsync(newData);
      toast.success('Venta creada exitosamente');

      const paymentTypeName = paymentTypeOptions.find((p: any) => p.value === data.idTypePay)?.label || '';

      const saleId = response?.data?.id ?? response?.id ?? 0;

      const adaptedData: HeaderSale = {
        header: {
          id: saleId,
          name: newData.name,
          date: dayjs(),
          address: data.address,
          total: Number(total.toFixed(2)),
          nit: data.nit,
          pay: paymentTypeName,
          idState: 1,
          paymentType: paymentTypeName
        },
        details: items.map((item, idx) => ({
          id: idx + 1,
          product: item.name,
          amount: item.amount,
          cost: item.price
        })),
        pay: {
          _id: 0,
          amount: Number(total.toFixed(2)),
          idOrden: saleId,
          idPaymentType: data.idTypePay,
          paymentDate: dayjs()
        }
      };

      if (company) {
        try {
          generateTicket(adaptedData, paymentTypeName, company as any);
        } catch (err) {
          // ignore print errors
        }
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CustomDialog>
        <ClientCreate />
      </CustomDialog>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Finalizar venta</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
              <Box sx={{ flex: 1 }}>
                <FormInputText name="nit" control={control} label="NIT" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); searchClient(); } }} />
              </Box>
              <Button onClick={searchClient} variant="contained" sx={{ mt: 1 }}>Buscar</Button>
              <Button onClick={showModal} variant="contained" color="success" sx={{ mt: 1 }}>Agregar</Button>
            </Box>
            <FormInputText name="name" control={control} label="Nombre / Razón Social" rules={{ required: 'Nombre es requerido' }} />
            <FormInputText name="address" control={control} label="Dirección" />
            <FormDropdown name="idTypeCli" control={control} label="Tipo de venta" options={clientTypeOptions} />
            <FormDropdown name="idTypePay" control={control} label="Forma de pago" options={paymentTypeOptions} />
            <Box sx={{ p: 2, bgcolor: '#f7f7f7', borderRadius: 2 }}>
              <Typography variant="subtitle2">Resumen</Typography>
              <Typography variant="body2">Productos: {items.length}</Typography>
              <Typography variant="h6">Total: Q {total.toFixed(2)}</Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit">Cancelar</Button>
          <Button onClick={handleSubmit(onSubmit)} variant="contained" disabled={loading}>
            {loading ? 'Procesando...' : 'Confirmar venta'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PosCheckoutDialog;
