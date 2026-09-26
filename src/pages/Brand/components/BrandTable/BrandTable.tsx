import React, { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tooltip, useMediaQuery,useTheme} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Brand } from '../../models';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Loading from '@/components/Loading';
import { AppIconButton } from '@/components';
import { totalPagesMovile } from '@/utils';
import { PERMISSIONS } from '@/modules/auth/helper/permissions';
import { usePermission } from '@/hooks/usePermission';
import TableMovil from '../TableMovil/TableMovil';
import { useActivateBrand, useBrand, useDeleteBrand } from '../../hooks/useBrand';
import { toast } from 'react-toastify';
import { getErrorMessage } from '@/utils/axiosClient';

type BrandTableProps = {
    onEditBrand: (brand: Brand) => void;
};

const ListOfBrands: React.FC<BrandTableProps> = ({ onEditBrand }) => {
    const { can } = usePermission();
    const canEdit = can(PERMISSIONS.BRANDS.UPDATE);
    const canDelete = can(PERMISSIONS.BRANDS.DELETE);
    const canActivate = can(PERMISSIONS.BRANDS.UPDATE);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
    const [brandToActivate, setBrandToActivate] = useState<Brand | null>(null);

    const deleteBrandMutation = useDeleteBrand();
    const activateBrandMutation = useActivateBrand();

    const {
        brands,
        totalBrand,
        isLoading,
        paginationModel,
        handlePaginationModelChange,
    } = useBrand();

    const handleConfirmDelete = async () => {
        if (!brandToDelete) return;

        try {
            await deleteBrandMutation.mutateAsync(brandToDelete.id);
            toast.success("Marca eliminada exitosamente");
            setBrandToDelete(null);
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    const handleActivate = async () => {
        if (!brandToActivate) return;

        try {
            await activateBrandMutation.mutateAsync(brandToActivate);
            toast.success("Marca activada exitosamente");
            setBrandToActivate(null);
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
            headerName: 'Marca',
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
                    const brand = params.row as Brand;
                    return (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {canEdit && brand.status && (
                                <Tooltip title="Editar">
                                    <AppIconButton
                                        color="success"
                                        onClick={() => onEditBrand(brand)}
                                    >
                                        <EditIcon />
                                    </AppIconButton>
                                </Tooltip>
                            )}
                            {canDelete && brand.status && (
                                <Tooltip title="Eliminar">
                                    <AppIconButton
                                        color="error"
                                        onClick={() => setBrandToDelete(brand)}
                                    >
                                        <DeleteIcon />
                                    </AppIconButton>
                                </Tooltip>
                            )}
                            {canActivate && !brand.status && (
                                <Tooltip title="Activar">
                                    <AppIconButton
                                        color="info"
                                        onClick={() => setBrandToActivate(brand)}
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
                    brands={brands}
                    totalBrand={totalBrand}
                    paginationModel={paginationModel}
                    handleEditBrand={onEditBrand}
                    handleDeleteBrand={setBrandToDelete}
                    handleActivateBrand={setBrandToActivate}
                    handlePaginationModelChange={handlePaginationModelChange}
                    totalPagesMobile={totalPagesMovile}
                    canEdit={canEdit}
                    canDelete={canDelete}
                    canActivate={canActivate}
                />
                
            ) : (
                <DataGrid
                    rows={brands}
                    rowCount={totalBrand}
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
                open={!!brandToDelete}
                onClose={() => setBrandToDelete(null)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Eliminar marca"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {`¿Estás seguro de que deseas eliminar "${brandToDelete?.name}"? Esta acción no se puede deshacer.`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setBrandToDelete(null)} color="primary">
                        Cancelar
                    </Button>
                    <Button sx={{borderRadius: 5}} onClick={handleConfirmDelete} color="error" variant="contained" autoFocus>
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={!!brandToActivate}
                onClose={() => setBrandToActivate(null)}
                aria-labelledby="activate-brand-dialog-title"
                aria-describedby="activate-brand-dialog-description"
            >
                <DialogTitle id="activate-brand-dialog-title">
                    {"Activar marca"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="activate-brand-dialog-description">
                        {`¿Estás seguro de que deseas activar la marca "${brandToActivate?.name}"?`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setBrandToActivate(null)} color="primary">
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

export default ListOfBrands;