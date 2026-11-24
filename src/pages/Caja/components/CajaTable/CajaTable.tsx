import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import { toast } from 'react-toastify';
import { AppIconButton } from '@/components';
import Loading from '@/components/Loading';
import { getErrorMessage } from '@/utils/axiosClient';
import { usePermission } from '@/hooks/usePermission';
import { PERMISSIONS } from '@/modules/auth/helper/permissions';
import { Caja } from '../../models';
import { useCaja, useDeleteCaja, useUpdateCaja } from '../../hooks/useCaja';

type Props = {
  onEdit: (caja: Caja) => void;
  onOpenSession: (caja: Caja) => void;
};

const CajaTable: React.FC<Props> = ({ onEdit, onOpenSession }) => {
  const { can } = usePermission();
  const canEdit = can(PERMISSIONS.CAJA.UPDATE);
  const canDelete = can(PERMISSIONS.CAJA.DELETE);
  const canOperate = can(PERMISSIONS.CAJA.OPERAR);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [toDelete, setToDelete] = useState<Caja | null>(null);
  const [toActivate, setToActivate] = useState<Caja | null>(null);

  const deleteCaja = useDeleteCaja();
  const updateCaja = useUpdateCaja();
  const { cajas, total, isLoading, paginationModel, handlePaginationModelChange } = useCaja();

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteCaja.mutateAsync(toDelete.id);
      toast.success('Caja eliminada exitosamente');
      setToDelete(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleActivate = async () => {
    if (!toActivate) return;
    try {
      await updateCaja.mutateAsync({ id: toActivate.id, payload: { estado: 1 } });
      toast.success('Caja activada exitosamente');
      setToActivate(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', minWidth: 90, flex: 0.4 },
    { field: 'name', headerName: 'Caja', minWidth: 180, flex: 1 },
    {
      field: 'branchName',
      headerName: 'Sucursal',
      minWidth: 160,
      flex: 1,
      renderCell: (params: GridRenderCellParams) => params.value || '-',
    },
    {
      field: 'status',
      headerName: 'Estado',
      minWidth: 120,
      flex: 0.6,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          size="small"
          label={params.value ? 'Activa' : 'Inactiva'}
          color={params.value ? 'success' : 'default'}
        />
      ),
    },
    ...(canEdit || canDelete || canOperate
      ? [
          {
            field: 'actions',
            type: 'actions' as const,
            sortable: false,
            headerName: 'Opciones',
            width: 180,
            renderCell: (params: GridRenderCellParams) => {
              const caja = params.row as Caja;
              return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {canOperate && caja.status && (
                    <Tooltip title="Abrir / operar sesión">
                      <AppIconButton color="primary" onClick={() => onOpenSession(caja)}>
                        <PointOfSaleIcon />
                      </AppIconButton>
                    </Tooltip>
                  )}
                  {canEdit && caja.status && (
                    <Tooltip title="Editar">
                      <AppIconButton color="success" onClick={() => onEdit(caja)}>
                        <EditIcon />
                      </AppIconButton>
                    </Tooltip>
                  )}
                  {canDelete && caja.status && (
                    <Tooltip title="Desactivar">
                      <AppIconButton color="error" onClick={() => setToDelete(caja)}>
                        <DeleteIcon />
                      </AppIconButton>
                    </Tooltip>
                  )}
                  {canEdit && !caja.status && (
                    <Tooltip title="Activar">
                      <AppIconButton color="info" onClick={() => setToActivate(caja)}>
                        <LockOpenIcon />
                      </AppIconButton>
                    </Tooltip>
                  )}
                </Box>
              );
            },
          } as GridColDef,
        ]
      : []),
  ];

  if (isLoading) return <Loading loading />;

  return (
    <div>
      {isMobile ? (
        <Stack spacing={1.5}>
          {cajas.map((caja) => (
            <Card key={caja.id} variant="outlined">
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography fontWeight={700}>{caja.name}</Typography>
                  <Chip
                    size="small"
                    label={caja.status ? 'Activa' : 'Inactiva'}
                    color={caja.status ? 'success' : 'default'}
                  />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  ID: {caja.id} {caja.branchName ? `· ${caja.branchName}` : ''}
                </Typography>
                <Stack direction="row" spacing={1} mt={1.5}>
                  {canOperate && caja.status && (
                    <Button size="small" variant="outlined" onClick={() => onOpenSession(caja)}>
                      Abrir/Operar
                    </Button>
                  )}
                  {canEdit && caja.status && (
                    <Button size="small" variant="outlined" color="success" onClick={() => onEdit(caja)}>
                      Editar
                    </Button>
                  )}
                  {canDelete && caja.status && (
                    <Button size="small" variant="outlined" color="error" onClick={() => setToDelete(caja)}>
                      Desactivar
                    </Button>
                  )}
                  {canEdit && !caja.status && (
                    <Button size="small" variant="outlined" onClick={() => setToActivate(caja)}>
                      Activar
                    </Button>
                  )}
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      ) : (
        <DataGrid
          rows={cajas}
          rowCount={total}
          columns={columns}
          getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row')}
          disableColumnSelector
          disableRowSelectionOnClick
          autoHeight
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: paginationModel.pageSize,
                page: paginationModel.page,
              },
            },
          }}
          onPaginationModelChange={handlePaginationModelChange}
          pageSizeOptions={[paginationModel.pageSize]}
          getRowId={(row: any) => row.id}
          paginationMode="server"
        />
      )}

      <Dialog open={!!toDelete} onClose={() => setToDelete(null)}>
        <DialogTitle>Desactivar caja</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas desactivar "{toDelete?.name}"? Si tiene una sesión abierta, el backend lo rechazará.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setToDelete(null)}>Cancelar</Button>
          <Button sx={{ borderRadius: 5 }} onClick={handleDelete} color="error" variant="contained">
            Desactivar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!toActivate} onClose={() => setToActivate(null)}>
        <DialogTitle>Activar caja</DialogTitle>
        <DialogContent>
          <DialogContentText>¿Deseas activar la caja "{toActivate?.name}"?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setToActivate(null)}>Cancelar</Button>
          <Button sx={{ borderRadius: 5 }} onClick={handleActivate} variant="contained">
            Activar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CajaTable;
