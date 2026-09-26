import React, { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tooltip, useMediaQuery,useTheme} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Presentation } from '../../models';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Loading from '@/components/Loading';
import { AppIconButton } from '@/components';
import { totalPagesMovile } from '@/utils';
import TableMovil from '../TableMovil/TableMovil';
import { useActivatePresentation, usePresentation, useDeletePresentation } from '../../hooks/usePresentation';
import { PERMISSIONS } from '@/modules/auth/helper/permissions';
import { usePermission } from '@/hooks/usePermission';
import { toast } from 'react-toastify';
import { getErrorMessage } from '@/utils/axiosClient';

type PresentationTableProps = {
    onEditPresentation: (presentation: Presentation) => void;
};

const ListOfPresentations: React.FC<PresentationTableProps> = ({ onEditPresentation }) => {
    const { can } = usePermission();
    const canEdit = can(PERMISSIONS.PRESENTATIONS.UPDATE);
    const canDelete = can(PERMISSIONS.PRESENTATIONS.DELETE);
    const canActivate = can(PERMISSIONS.PRESENTATIONS.UPDATE);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    const [presentationToDelete, setPresentationToDelete] = useState<Presentation | null>(null);
    const [presentationToActivate, setPresentationToActivate] = useState<Presentation | null>(null);

    const deletePresentationMutation = useDeletePresentation();
    const activatePresentationMutation = useActivatePresentation();

    const {
        presentations,
        totalPresentation,
        isLoading,
        paginationModel,
        handlePaginationModelChange,
    } = usePresentation();

    const handleConfirmDelete = async () => {
        if (!presentationToDelete) return;

        try {
            await deletePresentationMutation.mutateAsync(presentationToDelete.id);
            toast.success("Presentación eliminada exitosamente");
            setPresentationToDelete(null);
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    const handleActivate = async () => {
        if (!presentationToActivate) return;

        try {
            await activatePresentationMutation.mutateAsync(presentationToActivate);
            toast.success("Presentación activada exitosamente");
            setPresentationToActivate(null);
        } catch (error) {
            toast.error(getErrorMessage(error));
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
            headerName: 'Presentación',
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
                    const presentation = params.row as Presentation;
                    return (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {canEdit && presentation.status && (
                                <Tooltip title="Editar">
                                    <AppIconButton
                                        color="success"
                                        onClick={() => onEditPresentation(presentation)}
                                    >
                                        <EditIcon />
                                    </AppIconButton>
                                </Tooltip>
                            )}
                            {canDelete && presentation.status && (
                                <Tooltip title="Eliminar">
                                    <AppIconButton
                                        color="error"
                                        onClick={() => setPresentationToDelete(presentation)}
                                    >
                                        <DeleteIcon />
                                    </AppIconButton>
                                </Tooltip>
                            )}
                            {canActivate && !presentation.status && (
                                <Tooltip title="Activar">
                                    <AppIconButton
                                        color="info"
                                        onClick={() => setPresentationToActivate(presentation)}
                                    >
                                        <LockOpenIcon />
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
        return <Loading loading={isLoading}/>;
    }

    return (
        <div>
            {isMobile ? (
                <TableMovil
                    presentations={presentations}
                    totalPresentation={totalPresentation}
                    paginationModel={paginationModel}
                    handleEditPresentation={onEditPresentation}
                    handleDeletePresentation={setPresentationToDelete}
                    handleActivatePresentation={setPresentationToActivate}
                    handlePaginationModelChange={handlePaginationModelChange}
                    totalPagesMobile={totalPagesMovile}
                    canEdit={canEdit}
                    canDelete={canDelete}
                    canActivate={canActivate}
                />
                
            ) : (
                <DataGrid
                    rows={presentations}
                    rowCount={totalPresentation}
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
                open={!!presentationToDelete}
                onClose={() => setPresentationToDelete(null)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Eliminar presentación"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {`¿Estás seguro de que deseas eliminar "${presentationToDelete?.name}"? Esta acción no se puede deshacer.`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPresentationToDelete(null)} color="primary">
                        Cancelar
                    </Button>
                    <Button sx={{borderRadius: 5}} onClick={handleConfirmDelete} color="error" variant="contained" autoFocus>
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={!!presentationToActivate}
                onClose={() => setPresentationToActivate(null)}
                aria-labelledby="activate-presentation-dialog-title"
                aria-describedby="activate-presentation-dialog-description"
            >
                <DialogTitle id="activate-presentation-dialog-title">
                    {"Activar presentación"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="activate-presentation-dialog-description">
                        {`¿Estás seguro de que deseas activar la presentación "${presentationToActivate?.name}"?`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPresentationToActivate(null)} color="primary">
                        Cancelar
                    </Button>
                    <Button sx={{borderRadius: 5}} onClick={handleActivate} color="primary" variant="contained" autoFocus>
                        Activar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ListOfPresentations;