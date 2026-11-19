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
import { Color } from '../../models';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Loading from '@/components/Loading';
import { AppIconButton } from '@/components';
import { totalPagesMovile } from '@/utils';
import { PERMISSIONS } from '@/modules/auth/helper/permissions';
import { usePermission } from '@/hooks/usePermission';
import TableMovil from '../TableMovil/TableMovil';
import { useActivateColor, useDeleteColor, useColor } from '../../hooks/useColor';
import { toast } from 'react-toastify';
import { getErrorMessage } from '@/utils/axiosClient';

type ColorTableProps = {
  onEditColor: (color: Color) => void;
};

const ListOfColors: React.FC<ColorTableProps> = ({ onEditColor }) => {
  const { can } = usePermission();
  const canEdit = can(PERMISSIONS.COLORS.UPDATE);
  const canDelete = can(PERMISSIONS.COLORS.DELETE);
  const canActivate = can(PERMISSIONS.COLORS.UPDATE);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [colorToDelete, setColorToDelete] = useState<Color | null>(null);
  const [colorToActivate, setColorToActivate] = useState<Color | null>(null);

  const deleteColorMutation = useDeleteColor();
  const activateColorMutation = useActivateColor();

  const {
    colors,
    totalColor,
    isLoading,
    paginationModel,
    handlePaginationModelChange,
  } = useColor();

  const handleConfirmDelete = async () => {
    if (!colorToDelete) return;

    try {
      await deleteColorMutation.mutateAsync(colorToDelete.id);
      toast.success('Color eliminado exitosamente');
      setColorToDelete(null);
    } catch (error: any) {
      toast.error(error.message || 'Error desconocido');
    }
  };

  const handleActivate = async () => {
    if (!colorToActivate) return;

    try {
      await activateColorMutation.mutateAsync(colorToActivate);
      toast.success('Color activado exitosamente');
      setColorToActivate(null);
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
      renderCell: (params: GridRenderCellParams) => {
        const color = params.row as Color;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: 0.5,
                border: '1px solid #ccc',
                backgroundColor: color.hex || 'transparent',
                flexShrink: 0,
              }}
            />
            <span>{params.value}</span>
          </Box>
        );
      },
    },
    {
      field: 'hex',
      headerName: 'Hex',
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
              const color = params.row as Color;
              return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {canEdit && color.status && (
                    <Tooltip title="Editar">
                      <AppIconButton color="success" onClick={() => onEditColor(color)}>
                        <EditIcon />
                      </AppIconButton>
                    </Tooltip>
                  )}
                  {canDelete && color.status && (
                    <Tooltip title="Eliminar">
                      <AppIconButton color="error" onClick={() => setColorToDelete(color)}>
                        <DeleteIcon />
                      </AppIconButton>
                    </Tooltip>
                  )}
                  {canActivate && !color.status && (
                    <Tooltip title="Activar">
                      <AppIconButton color="info" onClick={() => setColorToActivate(color)}>
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
          colors={colors}
          totalColor={totalColor}
          paginationModel={paginationModel}
          handleEditColor={onEditColor}
          handleDeleteColor={setColorToDelete}
          handleActivateColor={setColorToActivate}
          handlePaginationModelChange={handlePaginationModelChange}
          totalPagesMobile={totalPagesMovile}
          canEdit={canEdit}
          canDelete={canDelete}
          canActivate={canActivate}
        />
      ) : (
        <DataGrid
          rows={colors}
          rowCount={totalColor}
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
        open={!!colorToDelete}
        onClose={() => setColorToDelete(null)}
        aria-labelledby="delete-color-title"
        aria-describedby="delete-color-description"
      >
        <DialogTitle id="delete-color-title">{'Eliminar color'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-color-description">
            {`¿Estás seguro de que deseas eliminar "${colorToDelete?.name}"? Esta acción no se puede deshacer.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setColorToDelete(null)} color="primary">
            Cancelar
          </Button>
          <Button sx={{ borderRadius: 5 }} onClick={handleConfirmDelete} color="error" variant="contained" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!colorToActivate}
        onClose={() => setColorToActivate(null)}
        aria-labelledby="activate-color-title"
        aria-describedby="activate-color-description"
      >
        <DialogTitle id="activate-color-title">{'Activar color'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="activate-color-description">
            {`¿Estás seguro de que deseas activar el color "${colorToActivate?.name}"?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setColorToActivate(null)} color="primary">
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

export default ListOfColors;
