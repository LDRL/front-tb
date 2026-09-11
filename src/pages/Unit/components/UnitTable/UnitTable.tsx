import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery, useTheme } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Unit } from '../../models';

import Loading from '@/components/Loading';
import { totalPagesMovile } from '@/utils';
import { PERMISSIONS } from '@/modules/auth/helper/permissions';
import { usePermission } from '@/hooks/usePermission';
import TableMovil from '../TableMovil/TableMovil';
import { useUnit, useDeleteUnit } from '../../hooks/useUnit';
import { editUnit } from '@/redux/unitSlice';
import { toast } from 'react-toastify';

const ListOfUnits: React.FC = () => {
    const { can } = usePermission();
    const canEdit = can(PERMISSIONS.UNITS.UPDATE);
    const canDelete = can(PERMISSIONS.UNITS.DELETE);
    const dispatch = useDispatch();
    const navigate = useNavigate();
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

    const handleEditUnit = (unit: Unit) => {
        dispatch(editUnit(unit));
        navigate(`${unit.id}/editar`)
    };

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
                headerName: 'Actions',
                width: 200,
                renderCell: (params: GridRenderCellParams) => (
                    <>
                        {canEdit && (
                            <Button
                                variant="contained"
                                color="success"
                                onClick={() => handleEditUnit(params.row as Unit)}
                                sx={{ mr: 1 }}
                            >
                                Editar
                            </Button>
                        )}
                        {canDelete && (
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => setUnitToDelete(params.row as Unit)}
                            >
                                Eliminar
                            </Button>
                        )}
                    </>
                ),
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
                    handleEditUnit={handleEditUnit}
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