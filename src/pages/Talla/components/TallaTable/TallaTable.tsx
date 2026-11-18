import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Talla } from '../../models';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Loading from '@/components/Loading';
import { AppIconButton } from '@/components';
import { totalPagesMovile } from '@/utils';
import { PERMISSIONS } from '@/modules/auth/helper/permissions';
import { usePermission } from '@/hooks/usePermission';
import TableMovil from '../TableMovil/TableMovil';
import { useActivateTalla, useDeleteTalla, useTalla } from '../../hooks/useTalla';
import { toast } from 'react-toastify';
import { getErrorMessage } from '@/utils/axiosClient';

type TallaTableProps = {
  onEditTalla: (talla: Talla) => void;
};

const ListOfTallas: React.FC<TallaTableProps> = ({ onEditTalla }) => {
  const { can } = usePermission();
  const canEdit = can(PERMISSIONS.TALLAS.UPDATE);
  const canDelete = can(PERMISSIONS.TALLAS.DELETE);
  const canActivate = can(PERMISSIONS.TALLAS.UPDATE);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [tallaToDelete, setTallaToDelete] = useState<Talla | null>(null);
  const [tallaToActivate, setTallaToActivate] = useState<Talla | null>(null);

  const deleteTallaMutation = useDeleteTalla();
  const activateTallaMutation = useActivateTalla();

  const {
    tallas,
    totalTalla,
    isLoading,
    paginationModel,
    handlePaginationModelChange,
  } = useTalla();

  const handleConfirmDelete = async () => {
    if (!tallaToDelete) return;

    try {
      await deleteTallaMutation.mutateAsync(tallaToDelete.id);
      toast.success('Talla eliminada exitosamente');
      setTallaToDelete(null);
    } catch (error: any) {
      toast.error(error.message || 'Error desconocido');
    }
  };

  const handleActivate = async () => {
    if (!tallaToActivate) return;

    try {
      await activateTallaMutation.mutateAsync(tallaToActivate);
      toast.success('Talla activada exitosamente');
      setTallaToActivate(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'Codigo',
      flex: 1,
      minWidth: 120,
      renderCell: (params: GridRenderCellParams) => (
        <div style={{ display: isMobile ? 'block' : 'inline' }}>{params.value}</div>
      ),
    },
    {
      field: 'name',
      headerName: 'Nombre',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <div style={{ display: isMobile ? 'block' : 'inline' }}>{params.value}</div>
      ),
    },
    {
      field: 'type',
      headerName: 'Tipo',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <div style={{ display: isMobile ? 'block' : 'inline' }}>{params.value}</div>
      ),
    },
    {
      field: 'order',
      headerName: 'Orden',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <div style={{ display: isMobile ? 'block' : 'inline' }}>{params.value}</div>
      ),
    },
    {
      field: 'status',
      headerName: 'Estado',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <div style={{ display: isMobile ? 'block' : 'inline' }}>
          {params.value ? 'Activo' : 'Inactivo'}
        </div>
      ),
    },
    ...(canEdit || canDelete
      ? [
          {
            field: 'actions',
            type: 'actions' as const,
            sortable: false,
            headerName: 'Opciones',
            width: 130,
            renderCell: (params: GridRenderCellParams) => {
              const talla = params.row as Talla;
              return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {canEdit && talla.status && (
                    <Tooltip title="Editar">
                      <AppIconButton color="success" onClick={() => onEditTalla(talla)}>
                        <EditIcon />
                      </AppIconButton>
                    </Tooltip>
                  )}
                  {canDelete && talla.status && (
                    <Tooltip title="Eliminar">
                      <AppIconButton color="error" onClick={() => setTallaToDelete(talla)}>
                        <DeleteIcon />
                      </AppIconButton>
                    </Tooltip>
                  )}
                  {canActivate && !talla.status && (
                    <Tooltip title="Activar">
                      <AppIconButton color="info" onClick={() => setTallaToActivate(talla)}>
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

  if (isLoading) {
    return <Loading loading={isLoading} />;
  }

  return (
    <div>
      {isMobile ? (
        <TableMovil
          tallas={tallas}
          totalTalla={totalTalla}
          paginationModel={paginationModel}
          handleEditTalla={onEditTalla}
          handleDeleteTalla={setTallaToDelete}
          handleActivateTalla={setTallaToActivate}
          handlePaginationModelChange={handlePaginationModelChange}
          totalPagesMobile={totalPagesMovile}
          canEdit={canEdit}
          canDelete={canDelete}
          canActivate={canActivate}
        />
      ) : (
        <DataGrid
          rows={tallas}
          rowCount={totalTalla}
          columns={columns}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row'
          }
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

      <Dialog
        open={!!tallaToDelete}
        onClose={() => setTallaToDelete(null)}
        aria-labelledby="delete-talla-title"
        aria-describedby="delete-talla-description"
      >
        <DialogTitle id="delete-talla-title">{'Eliminar talla'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-talla-description">
            {`¿Estás seguro de que deseas eliminar "${tallaToDelete?.name}"? Esta acción no se puede deshacer.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTallaToDelete(null)} color="primary">
            Cancelar
          </Button>
          <Button sx={{ borderRadius: 5 }} onClick={handleConfirmDelete} color="error" variant="contained" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!tallaToActivate}
        onClose={() => setTallaToActivate(null)}
        aria-labelledby="activate-talla-title"
        aria-describedby="activate-talla-description"
      >
        <DialogTitle id="activate-talla-title">{'Activar talla'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="activate-talla-description">
            {`¿Estás seguro de que deseas activar la talla "${tallaToActivate?.name}"?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTallaToActivate(null)} color="primary">
            Cancelar
          </Button>
          <Button sx={{ borderRadius: 5 }} onClick={handleActivate} color="primary" variant="contained" autoFocus>
            Activar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ListOfTallas;
