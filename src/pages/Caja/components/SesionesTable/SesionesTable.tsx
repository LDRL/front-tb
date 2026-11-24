import React, { useMemo, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  Chip,
  MenuItem,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AppIconButton } from '@/components';
import Loading from '@/components/Loading';
import axiosClient from '@/utils/axiosClient';
import { useFetchCajas, useSesiones } from '../../hooks/useCaja';
import { CajaSesion } from '../../models';

const money = (value: number | null | undefined) => `Q ${Number(value ?? 0).toFixed(2)}`;
const formatDate = (value?: string | null) => (value ? new Date(value).toLocaleString() : '-');

export const SesionesTable: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [estado, setEstado] = useState<'ABIERTA' | 'CERRADA' | ''>('');
  const [idcaja, setIdcaja] = useState<number | ''>('');
  const [idusuario, setIdusuario] = useState<number | ''>('');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');

  const { data: cajasResp } = useFetchCajas(1, '');
  const cajas = useMemo(() => cajasResp?.data ?? [], [cajasResp]);

  const { data: usuariosResp } = useQuery({
    queryKey: ['usuarios-caja-filter'],
    queryFn: async () => {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await axiosClient.get(`${apiUrl}usuarios`, { params: { page: 1, limit: 100 } });
      return response.data?.data ?? response.data?.usuarios ?? [];
    },
  });
  const usuarios = useMemo(() => (Array.isArray(usuariosResp) ? usuariosResp : []), [usuariosResp]);

  const params = useMemo(
    () => ({
      page: page + 1,
      limit: pageSize,
      ...(estado ? { estado } : {}),
      ...(idcaja ? { idcaja: Number(idcaja) } : {}),
      ...(idusuario ? { idusuario: Number(idusuario) } : {}),
      ...(desde ? { desde } : {}),
      ...(hasta ? { hasta } : {}),
    }),
    [page, pageSize, estado, idcaja, idusuario, desde, hasta]
  );

  const { data, isLoading, error } = useSesiones(params);
  const rows = data?.data ?? [];
  const total = data?.meta?.total ?? 0;

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', minWidth: 80, flex: 0.4 },
    {
      field: 'cajaName',
      headerName: 'Caja',
      minWidth: 150,
      flex: 1,
      renderCell: (params: GridRenderCellParams<CajaSesion>) => params.row.cajaName || `#${params.row.cajaId}`,
    },
    {
      field: 'status',
      headerName: 'Estado',
      minWidth: 120,
      flex: 0.6,
      renderCell: (params: GridRenderCellParams<CajaSesion>) => (
        <Chip
          size="small"
          label={params.row.status}
          color={params.row.status === 'ABIERTA' ? 'success' : 'default'}
        />
      ),
    },
    {
      field: 'openedBy',
      headerName: 'Abrió',
      minWidth: 150,
      flex: 1,
      renderCell: (params: GridRenderCellParams<CajaSesion>) => params.row.openedBy?.name || '-',
    },
    {
      field: 'closedBy',
      headerName: 'Cerró',
      minWidth: 150,
      flex: 1,
      renderCell: (params: GridRenderCellParams<CajaSesion>) => params.row.closedBy?.name || '-',
    },
    {
      field: 'openedAt',
      headerName: 'Apertura',
      minWidth: 170,
      flex: 1,
      renderCell: (params: GridRenderCellParams<CajaSesion>) => formatDate(params.row.openedAt),
    },
    {
      field: 'closedAt',
      headerName: 'Cierre',
      minWidth: 170,
      flex: 1,
      renderCell: (params: GridRenderCellParams<CajaSesion>) => formatDate(params.row.closedAt),
    },
    {
      field: 'openingAmount',
      headerName: 'Apertura Q',
      minWidth: 120,
      flex: 0.7,
      renderCell: (params: GridRenderCellParams<CajaSesion>) => money(params.row.openingAmount),
    },
    {
      field: 'difference',
      headerName: 'Diferencia',
      minWidth: 120,
      flex: 0.7,
      renderCell: (params: GridRenderCellParams<CajaSesion>) =>
        params.row.status === 'CERRADA' ? money(params.row.difference) : '-',
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Ver',
      width: 90,
      sortable: false,
      renderCell: (params: GridRenderCellParams<CajaSesion>) => (
        <AppIconButton color="primary" onClick={() => navigate(`/private/caja/sesiones/${params.row.id}`)}>
          <VisibilityIcon />
        </AppIconButton>
      ),
    },
  ];

  return (
    <Card variant="outlined" sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={700} mb={2}>
          Historial de sesiones
        </Typography>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mb={2}>
          <TextField
            select
            label="Caja"
            value={idcaja}
            onChange={(e) => {
              setIdcaja(e.target.value === '' ? '' : Number(e.target.value));
              setPage(0);
            }}
            size="small"
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">Todas</MenuItem>
            {cajas.map((caja) => (
              <MenuItem key={caja.idcaja} value={caja.idcaja}>
                {caja.nombre}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Usuario"
            value={idusuario}
            onChange={(e) => {
              setIdusuario(e.target.value === '' ? '' : Number(e.target.value));
              setPage(0);
            }}
            size="small"
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">Todos</MenuItem>
            {usuarios.map((u: any) => {
              const id = u._id ?? u.id;
              const name = [u.nombre, u.apellido].filter(Boolean).join(' ').trim() || u.username || `Usuario ${id}`;
              return (
                <MenuItem key={id} value={id}>
                  {name}
                </MenuItem>
              );
            })}
          </TextField>

          <TextField
            select
            label="Estado"
            value={estado}
            onChange={(e) => {
              setEstado(e.target.value as 'ABIERTA' | 'CERRADA' | '');
              setPage(0);
            }}
            size="small"
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="ABIERTA">ABIERTA</MenuItem>
            <MenuItem value="CERRADA">CERRADA</MenuItem>
          </TextField>

          <TextField
            label="Desde"
            type="date"
            value={desde}
            onChange={(e) => {
              setDesde(e.target.value);
              setPage(0);
            }}
            size="small"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Hasta"
            type="date"
            value={hasta}
            onChange={(e) => {
              setHasta(e.target.value);
              setPage(0);
            }}
            size="small"
            InputLabelProps={{ shrink: true }}
          />

          <Button
            variant="outlined"
            onClick={() => {
              setEstado('');
              setIdcaja('');
              setIdusuario('');
              setDesde('');
              setHasta('');
              setPage(0);
            }}
            sx={{ borderRadius: 5 }}
          >
            Limpiar
          </Button>
        </Stack>

        {isLoading && <Loading loading />}
        {error && <Typography color="error">{error.message}</Typography>}

        {!isLoading && !error && (
          isMobile ? (
            <Stack spacing={1.5}>
              {rows.map((sesion) => (
                <Card key={sesion.id} variant="outlined">
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography fontWeight={700}>{sesion.cajaName || `Caja #${sesion.cajaId}`}</Typography>
                      <Chip
                        size="small"
                        label={sesion.status}
                        color={sesion.status === 'ABIERTA' ? 'success' : 'default'}
                      />
                    </Stack>
                    <Typography variant="body2" color="text.secondary">Abrió: {sesion.openedBy?.name || '-'}</Typography>
                    <Typography variant="body2" color="text.secondary">Cerró: {sesion.closedBy?.name || '-'}</Typography>
                    <Typography variant="body2" color="text.secondary">Apertura: {formatDate(sesion.openedAt)}</Typography>
                    <Typography variant="body2" color="text.secondary">Cierre: {formatDate(sesion.closedAt)}</Typography>
                    <Typography variant="body2" color="text.secondary">Diferencia: {sesion.status === 'CERRADA' ? money(sesion.difference) : '-'}</Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{ mt: 1.5, borderRadius: 5 }}
                      onClick={() => navigate(`/private/caja/sesiones/${sesion.id}`)}
                    >
                      Ver detalle
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          ) : (
            <DataGrid
              rows={rows}
              rowCount={total}
              columns={columns}
              getRowId={(row) => row.id}
              autoHeight
              disableColumnSelector
              disableRowSelectionOnClick
              paginationMode="server"
              pageSizeOptions={[10, 20, 50]}
              paginationModel={{ page, pageSize }}
              onPaginationModelChange={(model) => {
                setPage(model.page);
                setPageSize(model.pageSize);
              }}
              getRowClassName={(params) =>
                params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row'
              }
            />
          )
        )}
      </CardContent>
    </Card>
  );
};

export default SesionesTable;
