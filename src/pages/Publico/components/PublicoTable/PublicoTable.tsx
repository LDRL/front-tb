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
import { Publico } from '../../models';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Loading from '@/components/Loading';
import { AppIconButton } from '@/components';
import { totalPagesMovile } from '@/utils';
import { PERMISSIONS } from '@/modules/auth/helper/permissions';
import { usePermission } from '@/hooks/usePermission';
import TableMovil from '../TableMovil/TableMovil';
import { useActivatePublico, useDeletePublico, usePublico } from '../../hooks/usePublico';
import { toast } from 'react-toastify';
import { getErrorMessage } from '@/utils/axiosClient';

type PublicoTableProps = {
  onEditPublico: (publico: Publico) => void;
};

const ListOfPublicos: React.FC<PublicoTableProps> = ({ onEditPublico }) => {
  const { can } = usePermission();
  const canEdit = can(PERMISSIONS.PUBLICOS.UPDATE);
  const canDelete = can(PERMISSIONS.PUBLICOS.DELETE);
  const canActivate = can(PERMISSIONS.PUBLICOS.UPDATE);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [publicoToDelete, setPublicoToDelete] = useState<Publico | null>(null);
  const [publicoToActivate, setPublicoToActivate] = useState<Publico | null>(null);

  const deletePublicoMutation = useDeletePublico();
  const activatePublicoMutation = useActivatePublico();

  const {
    publicos,
    totalPublico,
    isLoading,
    paginationModel,
    handlePaginationModelChange,
  } = usePublico();

  const handleConfirmDelete = async () => {
    if (!publicoToDelete) return;

    try {
      await deletePublicoMutation.mutateAsync(publicoToDelete.id);
      toast.success('Público eliminado exitosamente');
      setPublicoToDelete(null);
    } catch (error: any) {
      toast.error(error.message || 'Error desconocido');
    }
  };

  const handleActivate = async () => {
    if (!publicoToActivate) return;

    try {
      await activatePublicoMutation.mutateAsync(publicoToActivate);
      toast.success('Público activado exitosamente');
      setPublicoToActivate(null);
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
              const publico = params.row as Publico;
              return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {canEdit && publico.status && (
                    <Tooltip title="Editar">
                      <AppIconButton color="success" onClick={() => onEditPublico(publico)}>
                        <EditIcon />
                      </AppIconButton>
                    </Tooltip>
                  )}
                  {canDelete && publico.status && (
                    <Tooltip title="Eliminar">
                      <AppIconButton color="error" onClick={() => setPublicoToDelete(publico)}>
                        <DeleteIcon />
                      </AppIconButton>
                    </Tooltip>
                  )}
                  {canActivate && !publico.status && (
                    <Tooltip title="Activar">
                      <AppIconButton color="info" onClick={() => setPublicoToActivate(publico)}>
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
          publicos={publicos}
          totalPublico={totalPublico}
          paginationModel={paginationModel}
          handleEditPublico={onEditPublico}
          handleDeletePublico={setPublicoToDelete}
          handleActivatePublico={setPublicoToActivate}
          handlePaginationModelChange={handlePaginationModelChange}
          totalPagesMobile={totalPagesMovile}
          canEdit={canEdit}
          canDelete={canDelete}
          canActivate={canActivate}
        />
      ) : (
        <DataGrid
          rows={publicos}
          rowCount={totalPublico}
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
        open={!!publicoToDelete}
        onClose={() => setPublicoToDelete(null)}
        aria-labelledby="delete-publico-title"
        aria-describedby="delete-publico-description"
      >
        <DialogTitle id="delete-publico-title">{'Eliminar público'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-publico-description">
            {`¿Estás seguro de que deseas eliminar "${publicoToDelete?.name}"? Esta acción no se puede deshacer.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPublicoToDelete(null)} color="primary">
            Cancelar
          </Button>
          <Button sx={{ borderRadius: 5 }} onClick={handleConfirmDelete} color="error" variant="contained" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!publicoToActivate}
        onClose={() => setPublicoToActivate(null)}
        aria-labelledby="activate-publico-title"
        aria-describedby="activate-publico-description"
      >
        <DialogTitle id="activate-publico-title">{'Activar público'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="activate-publico-description">
            {`¿Estás seguro de que deseas activar el público "${publicoToActivate?.name}"?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPublicoToActivate(null)} color="primary">
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

export default ListOfPublicos;
