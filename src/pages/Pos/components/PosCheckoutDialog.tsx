import React, { useEffect, useRef, useState } from 'react';
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
import { FormDropdown, FormInputNumber, FormInputText } from '@/components';
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
import { useSesionActual } from '@/pages/Caja/hooks/useCaja';

interface PosCheckoutDialogProps {
  open: boolean;
  onClose: () => void;
  items: PosCartItem[];
  total: number;
  clientTypeId?: number;
  onClientTypeChange?: (id: number) => void;
  onSuccess: () => void;
}

interface CheckoutForm {
  nit: string;
  name: string;
  address: string;
  idTypeCli: number;
  idTypePay: number;
  amountPaid: number | '';
  isQuote: boolean;
}

const PosCheckoutDialog: React.FC<PosCheckoutDialogProps> = ({
  open,
  onClose,
  items,
  total,
  clientTypeId,
  onClientTypeChange,
  onSuccess,
}) => {
  const dispatch = useDispatch();
  const createSaleMutation = useCreateSaleHook();
  const { control, handleSubmit, setValue, getValues, watch } = useForm<CheckoutForm>({
    defaultValues: { nit: '', name: '', address: '', idTypeCli: clientTypeId ?? 0, idTypePay: 1, amountPaid: '', isQuote: false }
  });
  const { data: paymentTypeOptions = [] } = useFetchPaymentTypes();
  const { data: clientTypeOptions = [] } = useFetchTypeClientsOptions();
  const { client } = useClientSearch();
  const currentClient = useSelector((state: any) => state.client.currentClient);
  const company = useAppSelector((state: AppStore) => state.auth.user.company);
  const { data: sesionActual } = useSesionActual();
  const [loading, setLoading] = useState(false);
  const watchedTypeCli = watch('idTypeCli');
  const watchedTypePay = watch('idTypePay');
  const watchedAmountPaid = watch('amountPaid');

  const selectedPaymentLabel = (paymentTypeOptions as any[]).find((p) => Number(p.value) === Number(watchedTypePay))?.label || '';
  const isCashPayment = /efectivo/i.test(String(selectedPaymentLabel));
  const amountPaidNumber = Number(watchedAmountPaid || 0);
  const changeAmount = isCashPayment ? Math.max(0, Number((amountPaidNumber - total).toFixed(2))) : 0;
  const prevOpenRef = useRef(false);
  const clientTypeAtOpenRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const wasOpen = prevOpenRef.current;
    prevOpenRef.current = open;

    if (!open) return;
    // Reset only when opening the dialog, not on every clientTypeId change while open
    if (!wasOpen) {
      clientTypeAtOpenRef.current = clientTypeId;
      dispatch(clearClient());
      dispatch(setSearchNit(''));
      setValue('nit', '');
      setValue('name', '');
      setValue('address', '');
      // Default: minorista si existe; si no, mantener tipo actual o el primero disponible
      const minorista = (clientTypeOptions as { value: number; label: string }[]).find((o) => /minor/i.test(o.label || ''));
      const fallbackType = (clientTypeOptions[0] as any)?.value ? Number((clientTypeOptions[0] as any).value) : 1;
      const defaultType = clientTypeId ?? (minorista ? Number(minorista.value) : fallbackType);
      setValue('idTypeCli', defaultType);
      if (defaultType && defaultType !== clientTypeId) onClientTypeChange?.(defaultType);
      setValue('idTypePay', 1);
      setValue('amountPaid', '');
      setValue('isQuote', false);
    }
  }, [open, clientTypeId, dispatch, setValue]);

  // When client type changes in form (manual or from client), propagate to POS so cart reprices
  useEffect(() => {
    if (!open) return;
    const id = Number(watchedTypeCli);
    if (!id) return; // base price selected, don't override POS client type id
    if (id !== clientTypeId) {
      onClientTypeChange?.(id);
    }
  }, [watchedTypeCli, open, clientTypeId, onClientTypeChange]);

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
    // Keep the typed nit; do not clear it. Clear previous selection so new results apply.
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
        name: item.name,
        idvariante: item.idvariante ?? null,
        variantLabel: item.variantLabel,
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
        idCaja: sesionActual?.status === 'ABIERTA' ? sesionActual.cajaId : undefined,
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
      if (response?.advertencias?.length) {
        toast.warning('La venta se registró, pero hay advertencias de caja. Revisá la sesión de caja.');
      }

      const paymentTypeName = paymentTypeOptions.find((p: any) => p.value === data.idTypePay)?.label || '';
      const saleId = response?.id ?? response?.data?.id ?? 0;

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
          product: [item.name, item.presentationName, item.variantLabel].filter(Boolean).join(' - '),
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
            <FormDropdown name="idTypeCli" control={control} label="Tipo de cliente (precio)" options={clientTypeOptions} />
            <FormDropdown name="idTypePay" control={control} label="Forma de pago" options={paymentTypeOptions} />
            {isCashPayment && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                <FormInputNumber
                  name="amountPaid"
                  control={control}
                  label="¿Con cuánto paga tu cliente?"
                  startAdornment="Q"
                  maxDecimals={2}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 0.5 }}>
                  <Typography component="span" variant="body2" color="text.secondary">
                    Valor a devolver
                  </Typography>
                  <Typography component="span" variant="body1" sx={{ fontWeight: 700 }}>
                    Q {changeAmount.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            )}
            <Box sx={{ p: 2, bgcolor: '#f7f7f7', borderRadius: 2 }}>
              <Typography variant="subtitle2">Resumen</Typography>
              <Typography variant="body2">Productos: {items.length}</Typography>
              <Typography variant="h6">Total: Q {total.toFixed(2)}</Typography>
              <Typography variant="caption" color="text.secondary">
                Los precios se calculan según el tipo de cliente seleccionado.
              </Typography>
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
