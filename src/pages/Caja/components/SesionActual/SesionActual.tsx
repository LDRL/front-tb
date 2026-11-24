import React, { useMemo, useState } from 'react';
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
import { usePermission } from '@/hooks/usePermission';
import { PERMISSIONS } from '@/modules/auth/helper/permissions';
import Loading from '@/components/Loading';
import { useArqueo, useMovimientos, useSesionActual } from '../../hooks/useCaja';
import { Caja } from '../../models';
import { AbrirCajaDialog } from '../AbrirCajaDialog';
import { CerrarCajaDialog } from '../CerrarCajaDialog';
import { MovimientoDialog } from '../MovimientoDialog';

const money = (value: number | null | undefined) => `Q ${Number(value ?? 0).toFixed(2)}`;
const formatDate = (value?: string | null) => (value ? new Date(value).toLocaleString() : '-');

type Props = {
  selectedCaja?: Caja | null;
};

const SesionActual: React.FC<Props> = ({ selectedCaja }) => {
  const { can } = usePermission();
  const canOperate = can(PERMISSIONS.CAJA.OPERAR);

  const { data: sesion, isLoading, error, refetch } = useSesionActual();
  const sesionId = sesion?.id;
  const { data: arqueo } = useArqueo(sesionId, !!sesionId);
  const { data: movimientos, isLoading: loadingMovs } = useMovimientos(sesionId);

  const [openAbrir, setOpenAbrir] = useState(false);
  const [openCerrar, setOpenCerrar] = useState(false);
  const [openMovimiento, setOpenMovimiento] = useState(false);

  const resumen = useMemo(() => arqueo ?? sesion?.arqueo, [arqueo, sesion]);

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" gap={2} mb={2}>
          <Box>
            <Typography variant="h6" fontWeight={700}>Sesión de caja</Typography>
            <Typography variant="body2" color="text.secondary">
              Estado actual del usuario autenticado.
            </Typography>
          </Box>
          <Stack direction="row" gap={1} flexWrap="wrap">
            {canOperate && !sesion && (
              <Button
                variant="contained"
                sx={{ borderRadius: 5 }}
                onClick={() => setOpenAbrir(true)}
                disabled={!selectedCaja}
              >
                Abrir caja seleccionada
              </Button>
            )}
            {canOperate && sesion && sesion.status === 'ABIERTA' && (
              <>
                <Button variant="outlined" sx={{ borderRadius: 5 }} onClick={() => setOpenMovimiento(true)}>
                  Registrar movimiento
                </Button>
                <Button variant="contained" color="warning" sx={{ borderRadius: 5 }} onClick={() => setOpenCerrar(true)}>
                  Cerrar caja
                </Button>
              </>
            )}
          </Stack>
        </Stack>

        {isLoading && <Loading loading />}
        {error && <Alert severity="error">{error.message}</Alert>}

        {!isLoading && !sesion && (
          <Alert severity="info">
            No hay una sesión de caja abierta. {selectedCaja ? `Caja seleccionada: ${selectedCaja.name}.` : 'Seleccioná una caja activa en la tabla para abrirla.'}
          </Alert>
        )}

        {sesion && (
          <>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mb={2}>
              <Box sx={{ flex: 1, p: 1.5, bgcolor: '#f8fafc', borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary">Caja</Typography>
                <Typography fontWeight={700}>{sesion.cajaName || `#${sesion.cajaId}`}</Typography>
              </Box>
              <Box sx={{ flex: 1, p: 1.5, bgcolor: '#f8fafc', borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary">Estado</Typography>
                <Box mt={0.5}>
                  <Chip size="small" label={sesion.status} color={sesion.status === 'ABIERTA' ? 'success' : 'default'} />
                </Box>
              </Box>
              <Box sx={{ flex: 1, p: 1.5, bgcolor: '#f8fafc', borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary">Apertura</Typography>
                <Typography fontWeight={700}>{money(sesion.openingAmount)}</Typography>
                <Typography variant="caption" color="text.secondary">{formatDate(sesion.openedAt)}</Typography>
              </Box>
              <Box sx={{ flex: 1, p: 1.5, bgcolor: '#f8fafc', borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary">Esperado en efectivo</Typography>
                <Typography fontWeight={700}>{money(resumen?.expectedAmount)}</Typography>
              </Box>
            </Stack>

            {resumen && (
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mb={2}>
                <ResumenItem label="Ventas efectivo" value={money(resumen.cashSales.total)} detail={`${resumen.cashSales.operaciones} op.`} />
                <ResumenItem label="Compras efectivo" value={money(resumen.cashPurchases.total)} detail={`${resumen.cashPurchases.operaciones} op.`} />
                <ResumenItem label="Ingresos manuales" value={money(resumen.manualIncome.total)} detail={`${resumen.manualIncome.operaciones} op.`} />
                <ResumenItem label="Egresos manuales" value={money(resumen.manualExpenses.total)} detail={`${resumen.manualExpenses.operaciones} op.`} />
              </Stack>
            )}

            <Divider sx={{ my: 2 }} />
            <Typography fontWeight={700} mb={1}>Movimientos de la sesión</Typography>
            {loadingMovs ? (
              <Loading loading />
            ) : (
              <Box sx={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Concepto</TableCell>
                      <TableCell>Descripción</TableCell>
                      <TableCell align="right">Importe</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(movimientos ?? []).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5}>
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
                        <TableCell align="right">{money(mov.amount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            )}
          </>
        )}

        <AbrirCajaDialog
          open={openAbrir}
          onClose={() => setOpenAbrir(false)}
          caja={selectedCaja ?? null}
          onOpened={() => refetch()}
        />
        <CerrarCajaDialog
          open={openCerrar}
          onClose={() => setOpenCerrar(false)}
          sesion={sesion ?? null}
          arqueo={resumen ?? null}
          onClosed={() => refetch()}
        />
        <MovimientoDialog
          open={openMovimiento}
          onClose={() => setOpenMovimiento(false)}
          idsesion={sesion?.id ?? null}
          onCreated={() => refetch()}
        />
      </CardContent>
    </Card>
  );
};

const ResumenItem: React.FC<{ label: string; value: string; detail: string }> = ({ label, value, detail }) => (
  <Box sx={{ flex: 1, p: 1.5, border: '1px solid #e5e7eb', borderRadius: 2 }}>
    <Typography variant="caption" color="text.secondary">{label}</Typography>
    <Typography fontWeight={700}>{value}</Typography>
    <Typography variant="caption" color="text.secondary">{detail}</Typography>
  </Box>
);

export default SesionActual;
