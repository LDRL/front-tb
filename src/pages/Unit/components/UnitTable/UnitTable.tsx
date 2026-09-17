import React, { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Unit } from '../../models';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Loading from '@/components/Loading';
import { AppIconButton } from '@/components';
import { totalPagesMovile } from '@/utils';
import { PERMISSIONS } from '@/modules/auth/helper/permissions';
import { usePermission } from '@/hooks/usePermission';
import TableMovil from '../TableMovil/TableMovil';
import { useUnit, useDeleteUnit } from '../../hooks/useUnit';
import { toast } from 'react-toastify';

type UnitTableProps = {
  onEditUnit: (unit: Unit) => void;
};

const ListOfUnits: React.FC<UnitTableProps> = ({ onEditUnit }) => {
    const { can } = usePermission();
    const canEdit = can(PERMISSIONS.UNITS.UPDATE);
    const canDelete = can(PERMISSIONS.UNITS.DELETE);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [unitToDelete, setUnitToDelete] = useState<Unit | null>(null);

    const deleteUnitMutation = useDeleteUnit();

    const {
        units,
        totalUnit,
        isLoading,
        paginationModel,
        handlePaginationModelChange,
    } = useUnit();

    const handleConfirmDelete = async () => {
        if (!unitToDelete) return;

        try {
            await deleteUnitMutation.mutateAsync(unitToDelete.id);
            toast.success("Unidad de medida eliminada exitosamente");
            setUnitToDelete(null);
        } catch (error: any) {
            toast.error(error.message || "Error desconocido");
        }
    };

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'Codigo',
            flex: 1,
            minWidth: 150,
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
            field: 'abbreviation',
            headerName: 'Abreviatura',
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
            ? [{
                field: 'actions',
                type: 'actions' as const,
                sortable: false,
                headerName: 'Opciones',
                width: 130,
                renderCell: (params: GridRenderCellParams) => {
                    const unit = params.row as Unit;
                    return (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {canEdit && unit.status && (
                                <Tooltip title="Editar">
                                    <AppIconButton
                                        color="success"
                                        onClick={() => onEditUnit(unit)}
                                    >
                                        <EditIcon />
                                    </AppIconButton>
                                </Tooltip>
                            )}
                            {canDelete && unit.status && (
                                <Tooltip title="Eliminar">
                                    <AppIconButton
                                        color="error"
                                        onClick={() => setUnitToDelete(unit)}
                                    >
                                        <DeleteIcon />
                                    </AppIconButton>
                                </Tooltip>
                            )}
                        </Box>
                    );
                },
            } as GridColDef]
            : []),
    ];

    if (isLoading) {
        return <Loading loading={isLoading} />;
    }

    return (
        <div style={{ paddingRight: isMobile ? "40px" : "" }}>
            {isMobile ? (
                <TableMovil
                    units={units}
                    totalUnit={totalUnit}
                    paginationModel={paginationModel}
                    handleEditUnit={onEditUnit}
                    handleDeleteUnit={setUnitToDelete}
                    handlePaginationModelChange={handlePaginationModelChange}
                    totalPagesMobile={totalPagesMovile}
                    canEdit={canEdit}
                    canDelete={canDelete}
                />
            ) : (
                <DataGrid
                    rows={units}
                    rowCount={totalUnit}
                    columns={columns}
                    getRowClassName={(params) =>
                        params.indexRelativeToCurrentPage % 2 === 0
                            ? 'even-row'
                            : 'odd-row'
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
                open={!!unitToDelete}
                onClose={() => setUnitToDelete(null)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Eliminar unidad de medida"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {`¿Estás seguro de que deseas eliminar "${unitToDelete?.name}"? Esta acción no se puede deshacer.`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setUnitToDelete(null)} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained" autoFocus>
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ListOfUnits;