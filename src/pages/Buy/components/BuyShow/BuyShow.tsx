import { useNavigate, useParams } from "react-router-dom";
import { useRegisterBuyPayment, useShowBuy } from "../../hooks/useBuy";
import { CSSProperties, useEffect, useMemo, useState } from "react";
import { ClipLoader } from "react-spinners";
import LoadMask from "@/components/LoadMask/LoadMask";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CardForm from "@/components/Cards/CardForm";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { HeaderBuyAdapter } from "../../adapter";
import { FormDate, FormInputText } from "@/components";
import { useForm } from 'react-hook-form';
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { HeaderH } from "../../models/buy.view.type";
import { pageSize } from "@/utils";
import { getErrorMessage } from "@/utils/axiosClient";
import { useFetchPaymentTypes } from "@/pages/Sale/hooks/useSale";
import { useSesionActual } from "@/pages/Caja/hooks/useCaja";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
}

function BuyShow() {
  const navigate = useNavigate();
  const {id} = useParams<{id: string}>(); //Se captura el id de un producto
  const { data, isLoading, isError } = id ? useShowBuy(id) : { data: null, isLoading: false, isError: false };
  const adaptedData = data ? HeaderBuyAdapter(data.data):null;

  const { control, reset} = useForm<HeaderH>({
    defaultValues: { id: '', date: dayjs(), address: '', providerId: 0, providerName: '' }
  });
  
  const [color] = useState("#ffffff");
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number | ''>('');
  const [paymentType, setPaymentType] = useState<number>(1);
  const [paymentStatus, setPaymentStatus] = useState<'Pagado' | 'Pendiente'>('Pagado');

  const { data: paymentTypeOptions = [] } = useFetchPaymentTypes();
  const { data: sesionActual } = useSesionActual();
  const registerPayment = useRegisterBuyPayment();

  const totalPagado = useMemo(
    () => (adaptedData?.payments ?? []).reduce((acc, p) => acc + Number(p.amount || 0), 0),
    [adaptedData?.payments]
  );
  const saldoPendiente = useMemo(() => {
    if (adaptedData?.header.saldoPendiente !== undefined) return Number(adaptedData.header.saldoPendiente);
    return Math.max(0, Number(adaptedData?.header.total ?? 0) - totalPagado);
  }, [adaptedData?.header.saldoPendiente, adaptedData?.header.total, totalPagado]);

  useEffect(() => {
    if (!paymentTypeOptions.length) return;
    const efectivo = (paymentTypeOptions as any[]).find((p) => /efectivo/i.test(String(p.label || '')));
    if (efectivo?.value) setPaymentType(Number(efectivo.value));
  }, [paymentTypeOptions]);

  const openPaymentDialog = () => {
    if (saldoPendiente <= 0) return;
    setPaymentAmount(Number(saldoPendiente.toFixed(2)));
    setPaymentStatus('Pagado');
    setPaymentOpen(true);
  };

  const handleRegisterPayment = async () => {
    if (!id) return;
    const importe = Number(paymentAmount);
    if (!importe || importe <= 0) {
      toast.error('El importe debe ser mayor a 0');
      return;
    }
    if (importe > saldoPendiente + 0.01) {
      toast.error('El importe no puede ser mayor al saldo pendiente');
      return;
    }
    try {
      const result = await registerPayment.mutateAsync({
        id,
        payload: {
          importe,
          idtipopago: Number(paymentType),
          estado: paymentStatus,
          ...(paymentStatus === 'Pagado' && sesionActual?.status === 'ABIERTA' ? { idcaja: sesionActual.cajaId } : {}),
        },
      });
      toast.success('Pago registrado exitosamente');
      if (result?.advertencias?.length) {
        toast.warning('El pago se registró, pero hay advertencias de caja. Revisá la sesión de caja.');
      }
      setPaymentOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const columns: GridColDef[] = [
    {
        field: 'product',
        headerName: 'Producto',
        flex: 1.2,
        minWidth: 280,
        renderCell: (params: GridRenderCellParams) => <>{params.value}</>,
    },
    {
        field: 'variant',
        headerName: 'Variante',
        flex: 1,
        minWidth: 180,
        renderCell: (params: GridRenderCellParams) => <>{params.value || '-'}</>,
    },
    {
        field: 'amount',
        headerName: 'Cantidad',
        flex: 0.9,
        minWidth: 150,
        renderCell: (params: GridRenderCellParams) => <>{params.value}</>,
    },
    {
        field: 'cost',
        headerName: 'Precio',
        flex: 0.7,
        minWidth: 120,
        renderCell: (params: GridRenderCellParams) => <>Q {Number(params.value).toFixed(2)}</>,
    },
    {
        field: 'subtotal',
        headerName: 'Subtotal',
        flex: 0.7,
        minWidth: 120,
        renderCell: (params: GridRenderCellParams) => {
          const row = params.row as any;
          const qty = row.quantity ?? Number(String(row.amount ?? '').split(' - ')[0]) ?? 0;
          const subtotal = row.subtotal ?? qty * Number(row.cost ?? 0);
          return <>Q {Number(subtotal).toFixed(2)}</>;
        },
    }
  ];
  
  useEffect(() => {
    if (adaptedData?.header.id) {
      reset(adaptedData.header);
    }
  }, [adaptedData?.header.id]);
  
  
  if (isError) {
    return (
      <div className="container">
        <h2>Error al cargar los datos de la compra.</h2>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container">
        <h2>No se encontraron datos de la compra.</h2>
      </div>
    );
  }

  return (
    <div className='container'>
      {isLoading && (
        <div className="sweet-loading">
          <ClipLoader
            color={color}
            loading={isLoading}
            cssOverride={override}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}

      <CardForm
        titulo='Compra'
        subtitulo='Detalle'
      >
        <LoadMask/>
        <Box
        >
          <Box>
            <div className='section'>
              <div className='container_selector'>
                <FormInputText
                  name="id"
                  control={control}
                  label="Numero de compra"
                  disabled
                />
                <FormDate
                  name="date"
                  control={control}
                  label="Fecha"
                  disabled
                />
              </div>

              <FormInputText
                name="providerName"
                control={control}
                label="Proveedor"
                disabled
              />
            </div>

            <div className='section'>
              <FormInputText
                name="address"
                control={control}
                label="Direccion"
                disabled
              />
            </div>
          </Box>
          
          <DataGrid
            rows={adaptedData?.details || []}
            rowCount={adaptedData?.details ? adaptedData?.details.length: 0}
            columns={columns}
            disableColumnSelector
            disableRowSelectionOnClick
            autoHeight
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: pageSize,
                },
              },
            }}
            pageSizeOptions={[pageSize]}
            getRowId={(row: any) => row.id}
            paginationMode="server"
          />

          <br />
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
            <h2>Total: Q {Number(adaptedData?.header.total ?? 0).toFixed(2)}</h2>
          </div>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="flex-end" sx={{ mt: 1 }}>
            <Typography><strong>Pagado:</strong> Q {totalPagado.toFixed(2)}</Typography>
            <Typography color={saldoPendiente > 0 ? 'warning.main' : 'success.main'}>
              <strong>Saldo pendiente:</strong> Q {saldoPendiente.toFixed(2)}
            </Typography>
          </Stack>

          <Box sx={{ mt: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="h6">Pagos</Typography>
              <Button
                variant="contained"
                sx={{ borderRadius: 5 }}
                onClick={openPaymentDialog}
                disabled={registerPayment.isPending || saldoPendiente <= 0}
              >
                {saldoPendiente <= 0 ? 'Compra pagada' : 'Registrar pago'}
              </Button>
            </Stack>

            <DataGrid
              rows={adaptedData?.payments ?? []}
              columns={[
                { field: 'date', headerName: 'Fecha', flex: 1, minWidth: 160, renderCell: (p: any) => p.value ? dayjs(p.value).format('DD/MM/YYYY HH:mm') : '-' },
                { field: 'paymentTypeId', headerName: 'Tipo pago', flex: 0.7, minWidth: 110 },
                { field: 'status', headerName: 'Estado', flex: 0.7, minWidth: 120, renderCell: (p: any) => <Chip size="small" label={p.value} color={String(p.value).toLowerCase() === 'pagado' ? 'success' : 'warning'} /> },
                { field: 'amount', headerName: 'Importe', flex: 0.7, minWidth: 120, renderCell: (p: any) => <>Q {Number(p.value ?? 0).toFixed(2)}</> },
              ]}
              autoHeight
              disableColumnSelector
              disableRowSelectionOnClick
              pageSizeOptions={[5]}
              initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
              getRowId={(row: any) => row.id}
            />
          </Box>

          <div className='container_button'>
            <Button
              variant="contained"
              type="button"
              sx={{ mt: 2 }}
              color='error'
              onClick={() => navigate('/private/buy')}
            >
              Regresar
            </Button>
          </div>

          <Dialog open={paymentOpen} onClose={() => setPaymentOpen(false)} fullWidth maxWidth="xs">
            <DialogTitle>Registrar pago</DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2.5 }}>
              <TextField
                label="Importe"
                type="number"
                inputProps={{ min: 0.01, step: '0.01' }}
                fullWidth
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value === '' ? '' : Number(e.target.value))}
              />
              <TextField
                select
                label="Forma de pago"
                fullWidth
                value={paymentType}
                onChange={(e) => setPaymentType(Number(e.target.value))}
              >
                {paymentTypeOptions.map((opt: any) => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Estado"
                fullWidth
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as 'Pagado' | 'Pendiente')}
              >
                <MenuItem value="Pagado">Pagado</MenuItem>
                <MenuItem value="Pendiente">Pendiente</MenuItem>
              </TextField>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={() => setPaymentOpen(false)} color="error" variant="contained" sx={{ borderRadius: 5 }}>
                Cancelar
              </Button>
              <Button onClick={handleRegisterPayment} variant="contained" sx={{ borderRadius: 5 }} disabled={registerPayment.isPending}>
                Guardar
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </CardForm>
    </div>
  )
}

export default BuyShow