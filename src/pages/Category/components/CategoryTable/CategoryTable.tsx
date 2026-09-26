import React, { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tooltip, useMediaQuery,useTheme} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Category } from '../../models';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useActivateCategory, useCategory, useDeleteCategory } from '../../hooks/useCategory';
import { PERMISSIONS } from '@/modules/auth/helper/permissions';
import { usePermission } from '@/hooks/usePermission';

import Loading from '@/components/Loading';
import { AppIconButton } from '@/components';
import { totalPagesMovile } from '@/utils';
import TableMovil from '../TableMovil/TableMovil';
import { toast } from 'react-toastify';
import { getErrorMessage } from '@/utils/axiosClient';

type CategoryTableProps = {
    onEditCategory: (category: Category) => void;
};

const ListOfCategories: React.FC<CategoryTableProps> = ({ onEditCategory }) => {
    const { can } = usePermission();
    const canEdit = can(PERMISSIONS.CATEGORIES.UPDATE);
    const canDelete = can(PERMISSIONS.CATEGORIES.DELETE);
    const canActivate = can(PERMISSIONS.CATEGORIES.UPDATE);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
    const [categoryToActivate, setCategoryToActivate] = useState<Category | null>(null);

    const deleteCategoryMutation = useDeleteCategory();
    const activateCategoryMutation = useActivateCategory();

    const {
        categories,
        totalCategory,
        isLoading,
        paginationModel,
        handlePaginationModelChange,
    } = useCategory();

    const handleConfirmDelete = async () => {
        if (!categoryToDelete) return;

        try {
            await deleteCategoryMutation.mutateAsync(categoryToDelete.id);
            toast.success("Categoría eliminada exitosamente");
            setCategoryToDelete(null);
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    const handleActivate = async () => {
        if (!categoryToActivate) return;

        try {
            await activateCategoryMutation.mutateAsync(categoryToActivate);
            toast.success("Categoría activada exitosamente");
            setCategoryToActivate(null);
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
            headerName: 'Categoría',
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <div style={{ display: isMobile ? 'block' : 'inline' }}>{params.value}</div>
            ),
        },
        {
            field: 'status',
            headerName: 'Estado',
            flex:1,
            renderCell: (params: GridRenderCellParams) => ( <div>
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
                    const category = params.row as Category;
                    return (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {canEdit && category.status &&(
                                <Tooltip title="Editar">
                                    <AppIconButton
                                        color="success"
                                        onClick={() => onEditCategory(category)}
                                    >
                                        <EditIcon />
                                    </AppIconButton>
                                </Tooltip>
                            )}
                            {canDelete && category.status &&(
                                <Tooltip title="Eliminar">
                                    <AppIconButton
                                        color="error"
                                        onClick={() => setCategoryToDelete(category)}
                                    >
                                        <DeleteIcon />
                                    </AppIconButton>
                                </Tooltip>
                            )}
                            {canActivate && !category.status && (
                                <Tooltip title="Activar">
                                    <AppIconButton
                                        color="info"
                                        onClick={() => setCategoryToActivate(category)}
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
                    categories={categories}
                    totalCategory={totalCategory}
                    paginationModel={paginationModel}
                    handleEditCategory={onEditCategory}
                    handleDeleteCategory={setCategoryToDelete}
                    handleActivateCategory={setCategoryToActivate}
                    handlePaginationModelChange={handlePaginationModelChange}
                    totalPagesMobile={totalPagesMovile}
                    canEdit={canEdit}
                    canDelete={canDelete}
                    canActivate={canActivate}
                />
                
            ) : (
                <DataGrid
                    rows={categories}
                    rowCount={totalCategory}
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
                open={!!categoryToDelete}
                onClose={() => setCategoryToDelete(null)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Eliminar categoría"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {`¿Estás seguro de que deseas eliminar "${categoryToDelete?.name}"? Esta acción no se puede deshacer.`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCategoryToDelete(null)} color="primary">
                        Cancelar
                    </Button>
                    <Button sx={{borderRadius: 5}} onClick={handleConfirmDelete} color="error" variant="contained" autoFocus>
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={!!categoryToActivate}
                onClose={() => setCategoryToActivate(null)}
                aria-labelledby="activate-category-dialog-title"
                aria-describedby="activate-category-dialog-description"
            >
                <DialogTitle id="activate-category-dialog-title">
                    {"Activar categoría"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="activate-category-dialog-description">
                        {`¿Estás seguro de que deseas activar la categoría "${categoryToActivate?.name}"?`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCategoryToActivate(null)} color="primary">
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

export default ListOfCategories;