import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Loading from '@/components/Loading';
import { useArqueo, useGetSesion, useMovimientos } from '../../hooks/useCaja';

const money = (value: number | null | undefined) => `Q ${Number(value ?? 0).toFixed(2)}`;
const formatDate = (value?: string | null) => (value ? new Date(value).toLocaleString() : '-');

export default function CajaSesionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: sesion, isLoading, error } = useGetSesion(id);
  const { data: arqueo } = useArqueo(id, !!id);
  const { data: movimientos } = useMovimientos(id);

  if (isLoading) return <Loading loading />;
  if (error) return <Alert severity="error">{error.message}</Alert>;
  if (!sesion) return <Alert severity="warning">Sesión no encontrada.</Alert>;

  const resumen = arqueo ?? sesion.arqueo;

  return (
    <Box sx={{ p: 2 }}>
      <Stack direction="row" alignItems="center" gap={1} mb={2}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ borderRadius: 5 }}>
          Volver
        </Button>
        <Typography variant="h5" fontWeight={700}>
          Sesión #{sesion.id} - {sesion.cajaName || `Caja ${sesion.cajaId}`}
        </Typography>
        <Chip
          size="small"
          label={sesion.status}
          color={sesion.status === 'ABIERTA' ? 'success' : 'default'}
        />
      </Stack>

      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mb={2}>
            <Info label="Apertura" value={money(sesion.openingAmount)} detail={formatDate(sesion.openedAt)} />
            <Info label="Cierre" value={formatDate(sesion.closedAt)} detail={sesion.closedBy?.name || '-'} />
            <Info label="Esperado" value={money(resumen?.expectedAmount ?? sesion.expectedAmount)} />
            <Info label="Contado" value={money(resumen?.countedAmount ?? sesion.countedAmount)} />
            <Info label="Diferencia" value={money(resumen?.difference ?? sesion.difference)} />
          </Stack>

          {resumen && (
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <Info label="Ventas efectivo" value={money(resumen.cashSales.total)} detail={`${resumen.cashSales.operaciones} op.`} />
              <Info label="Compras efectivo" value={money(resumen.cashPurchases.total)} detail={`${resumen.cashPurchases.operaciones} op.`} />
              <Info label="Ingresos manuales" value={money(resumen.manualIncome.total)} detail={`${resumen.manualIncome.operaciones} op.`} />
              <Info label="Egresos manuales" value={money(resumen.manualExpenses.total)} detail={`${resumen.manualExpenses.operaciones} op.`} />
            </Stack>
          )}
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent>
          <Typography fontWeight={700} mb={1}>Movimientos</Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Concepto</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Usuario</TableCell>
                  <TableCell align="right">Importe</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(movimientos ?? []).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Typography variant="body2" color="text.secondary">Sin movimientos manuales.</Typography>
                    </TableCell>
                  </TableRow>
                )}
                {(movimientos ?? []).map((mov) => (
                  <TableRow key={mov.id}>
                    <TableCell>{formatDate(mov.date)}</TableCell>
                    <TableCell>
                      <Chip size="small" label={mov.type} color={mov.type === 'INGRESO' ? 'success' : 'error'} />
                    </TableCell>
                    <TableCell>{mov.concept}</TableCell>
                    <TableCell>{mov.description || mov.reference || '-'}</TableCell>
                    <TableCell>{mov.user?.name || '-'}</TableCell>
                    <TableCell align="right">{money(mov.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

function Info({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <Box sx={{ flex: 1, p: 1.5, bgcolor: '#f8fafc', borderRadius: 2 }}>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography fontWeight={700}>{value}</Typography>
      {detail && <Typography variant="caption" color="text.secondary">{detail}</Typography>}
    </Box>
  );
}
